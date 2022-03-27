package unused;
// Your First Program
import frink.parser.Frink;

class REPL {
    public static void main(String[] args) {
        System.out.println("3290"); 
        Frink interp = new Frink();
        // Enable security here? Currently commented-out.
        interp.setRestrictiveSecurity(true);

        // String results;
        try {
            results = interp.parseString("2+2");
            interp.r
        }
        catch (frink.errors.FrinkEvaluationException fee)
        {
            // Do whatever you want with the exception
        }

    }
}