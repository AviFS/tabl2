import frink.parser.Frink;

import java.io.ByteArrayOutputStream;
import java.io.Console;
import java.io.PrintStream;

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
        JSONObject json = new JSONObject();
        // json.put("a", 235);

        System.out.println("3290"); 
        Frink interp = new Frink();

        // Enable security here? Currently commented-out.
        // interp.setRestrictiveSecurity(true);

        Console console = System.console();
        String results;
        String input;
        
        // ByteArrayOutputStream output;
        ByteArrayOutputStream error;
        // PrintStream outputStream;
        PrintStream errorStream;
        // PrintStream systemOut = System.out;
        // PrintStream systemErr = System.err;
        while (true) {

            error = new ByteArrayOutputStream();
            errorStream = new PrintStream(error);
            System.setErr(errorStream);

            try {
                input = console.readLine(">>>>>\n");
                results = interp.parseString(input);

                // json.put("disp", results);
                json.put("disp", results);
                json.put("isError", false);
                // System.out.println(json);
            }
            catch (frink.errors.FrinkException err)
            {
                json.put("isError", true);
                json.put("disp", "");
                // System.out.println(json);
                // Do whatever you want with the exception
            }

            System.err.flush();
            json.put("error", error.toString());

            System.out.println(json);

        }
        
        // System.out.println(results);

    }
}