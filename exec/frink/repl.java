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

class REPL {
    public static void main(String[] args) {

        Frink interp = new Frink();

        // Enable security here? Currently commented-out.
        // interp.setRestrictiveSecurity(true);

        Scanner in = new Scanner(System.in);
        String results = "";
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
                results = interp.parseString(inputJSON.getString("code"));
            }
            catch (frink.errors.FrinkException err)
            {
            }

            System.err.flush();
            System.out.flush();
            System.setOut(systemOut);

            System.out.println(process(inputJSON, results));
        }
        in.close();
    }

    static JSONObject process(JSONObject inputJSON, String output) {
        JSONObject outputJSON = new JSONObject();
        JSONObject console = new JSONObject();
        if (output.contains("(undefined symbol)")) {
            outputJSON.put("isError", true);
            console.put("warn", output);
        }
        else if (output.contains("error")) {
            outputJSON.put("isError", true);
            console.put("error", output);
        }
        else {
            outputJSON.put("isError", false);
            outputJSON.put("disp", output);
        }
        outputJSON.put("console", console);
        outputJSON.put("line", inputJSON.get("line"));
        return outputJSON;
    }
}