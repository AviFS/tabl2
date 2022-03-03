import frink.parser.Frink;
import java.io.Console;
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
        while (true) {
            try {
                input = console.readLine(">>>>>\n");
                results = interp.parseString(input);

                json.put("disp", results);
                System.out.println(json);
            }
            catch (frink.errors.FrinkException err)
            {
                json.put("isError", true);
                // System.out.println(err);
                // Do whatever you want with the exception
            }
        }
        
        // System.out.println(results);

    }
}