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

        System.out.println("3290"); 
        Frink interp = new Frink();

        // Enable security here? Currently commented-out.
        // interp.setRestrictiveSecurity(true);

        Console console = System.console();
        String results;
        String input;
        
        ByteArrayOutputStream error;
        PrintStream errorStream;

        while (true) {

            // Capture stderr into variable `error`
            error = new ByteArrayOutputStream();
            errorStream = new PrintStream(error);
            System.setErr(errorStream);

            try {
                input = console.readLine(">>>>>\n");
                results = interp.parseString(input);

                json.put("disp", results);
                json.put("isError", false);
            }
            catch (frink.errors.FrinkException err)
            {
                json.put("isError", true);
                json.put("disp", "");
            }

            System.err.flush();
            json.put("error", error.toString());

            System.out.println(json);

        }
    }
}