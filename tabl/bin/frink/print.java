import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

public class print {
    public static void main(String[] args) {
        // Catch console output
        ByteArrayOutputStream output;
        PrintStream stream;
        PrintStream systemOut = System.out;

        for (int i = 0; i < 5; i++) {
            // Catch console output in `output`
            output = new ByteArrayOutputStream();
            stream = new PrintStream(output);
            System.setOut(stream);

            System.out.print(i);
            System.out.print("-");

            // Set console output back to console
            System.out.flush();
            System.setOut(systemOut);

            System.out.println("Here: {" + process(output.toString())+ "}");
        }
    }

    static String process(String output) {
        return output+"!";
    }
    
}
