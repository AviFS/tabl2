import frink.errors.FrinkEvaluationException;
import frink.parser.Frink;

import java.io.ByteArrayOutputStream;
import java.io.Console;
import java.io.PrintStream;
import java.util.Scanner;

import javax.print.event.PrintJobListener;

import org.json.JSONObject;



/*

Run with:
compile:
    javac -cp "json.jar:frink.jar" repl.java
run:
    java -cp "json.jar:frink.jar" repl.java
*/

public class REPL {
    public static int f(int n) { return 3*n; }
    public static void main(String[] args) {

        Frink interp = new Frink();

        // Enable security here? Currently commented-out.
        // interp.setRestrictiveSecurity(true);

        Scanner in = new Scanner(System.in);
        String returned;
        String input;
        
        ByteArrayOutputStream output;
        PrintStream outputStream;
        PrintStream systemOut = System.out;

        ByteArrayOutputStream error;
        PrintStream errorStream;

        JSONObject inputJSON;

        try {
            interp.parseString("2+2");
        } catch (FrinkEvaluationException e) {
        }

        System.out.println("Started up.");
        while (in.hasNextLine()) {

            // Capture stderr and ignore it
            error = new ByteArrayOutputStream();
            errorStream = new PrintStream(error);
            System.setErr(errorStream);

            // Capture stdout and ignore it
            output = new ByteArrayOutputStream();
            outputStream = new PrintStream(output);
            System.setOut(outputStream);

            input = in.nextLine();
            inputJSON = new JSONObject(input);

            try {
                returned = interp.parseString(inputJSON.getString("code"));
            }
            catch (frink.errors.FrinkException err)
            {
                returned = "";
            }

            System.err.flush();
            System.out.flush();
            System.setOut(systemOut);

            System.out.println(process(inputJSON, returned, output.toString(), error.toString()));

            // System.out.println("---");
            // System.out.println("returned: "+returned);
            // System.out.println("output: "+output);
            // System.out.println("error: "+error);
        }
        in.close();
    }

    // should at least remove all lines starting with "at" to get rid of the stacktraces
    static String trimError(String errorString) { return errorString; }

    static JSONObject process(JSONObject inputJSON, String returned, String output, String error) {
        JSONObject outputJSON = new JSONObject();
        JSONObject console = new JSONObject();

        // this is hacky, but so is frink's error handling
        // sometimes they show up in `returned`, sometimes they show up in `output`, and sometimes they show up in `error`
        // error isn't perfect either because warnings, like undefined names, don't get printed there
        // plus the error is super long due to the stack trace

        // checking (returned+output) isn't enough
        // checking (error) isn't enough
        // checking (returned+error) may be enough, though

        if (returned.contains("(undefined symbol)")) {
            outputJSON.put("isError", true);
            console.put("warn", returned);
        }
        // unfortunately, we have to check "error" & "Error"
        // neither one is enough alone
        // this is a hacky way of checking both

        else if (returned.contains("rror") || output.contains("rror") || error.contains("rror")) {
            outputJSON.put("isError", true);
            String errorString = "";
            if (returned.contains("rror")) { errorString += returned; }
            if (output.contains("rror")) { errorString += output; }
            if (error.contains("rror")) { errorString += error; }

            console.put("error", trimError(errorString));

            // Not sending back the error text until trimError() is decent
            // The errors are super long to be sending back otherwise
            console.put("error", "Error");
        }
        else {
            outputJSON.put("isError", false);
            outputJSON.put("disp", returned);
        }
        outputJSON.put("console", console);
        outputJSON.put("line", inputJSON.get("line"));
        return outputJSON;
    }
}