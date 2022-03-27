import java.util.Scanner;

public class input {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String input;
        while (in.hasNextLine()) {
            input = in.nextLine();
            System.out.println("> " + input + " <");
        }
    }
    
}
