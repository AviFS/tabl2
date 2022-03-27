
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;
import java.util.Collections;
import org.java_websocket.WebSocket;
import org.java_websocket.drafts.Draft;
import org.java_websocket.drafts.Draft_6455;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;


import frink.errors.FrinkEvaluationException;
import frink.parser.Frink;

import java.io.ByteArrayOutputStream;
import java.io.Console;
import java.io.PrintStream;
import java.util.Scanner;

import javax.print.event.PrintJobListener;

import org.json.JSONObject;

/* Run with:

javac -cp "websocket.jar:frink.jar:json.jar" FrinkServer.java
java -cp "websocket.jar:frink.jar:json.jar" FrinkServer.java

*/

public class FrinkServer extends WebSocketServer {

    Frink interp;

    // Enable security here? Currently commented-out.
    // interp.setRestrictiveSecurity(true);

    Scanner in;
    String returned;
    String input;
    
    ByteArrayOutputStream output;
    PrintStream outputStream;
    PrintStream systemOut = System.out;

    ByteArrayOutputStream error;
    PrintStream errorStream;

    JSONObject inputJSON;

    public static void main(String[] args) throws UnknownHostException {
        System.out.println("Started up.");
        FrinkServer frinkServer = new FrinkServer(8884);
        frinkServer.start();
    }

  public FrinkServer(int port) throws UnknownHostException {
    super(new InetSocketAddress(port));
  }

  public FrinkServer(InetSocketAddress address) {
    super(address);
  }

  public FrinkServer(int port, Draft_6455 draft) {
    super(new InetSocketAddress(port), Collections.<Draft>singletonList(draft));
  }

  @Override
  public void onOpen(WebSocket conn, ClientHandshake handshake) {
    interp = new Frink();
    in = new Scanner(System.in);
    System.out.println("Connected");
  }

  @Override
  public void onClose(WebSocket conn, int code, String reason, boolean remote) {
      in.close();
  }

  @Override
  public void onMessage(WebSocket conn, String message) {
    
    System.out.println(message);
    // Capture stderr and ignore it
    error = new ByteArrayOutputStream();
    errorStream = new PrintStream(error);
    System.setErr(errorStream);

    // Capture stdout and ignore it
    output = new ByteArrayOutputStream();
    outputStream = new PrintStream(output);
    System.setOut(outputStream);

    // input = in.nextLine();
    input = message;

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

    conn.send(process(inputJSON, returned, output.toString(), error.toString()).toString());

    // System.out.println("---");
    // System.out.println("returned: "+returned);
    // System.out.println("output: "+output);
    // System.out.println("error: "+error);
}

  @Override
  public void onMessage(WebSocket conn, ByteBuffer message) {
      onMessage(conn, message.array().toString());
  }

  @Override
  public void onError(WebSocket conn, Exception ex) {
    ex.printStackTrace();
  }

  @Override
  public void onStart() {
    setConnectionLostTimeout(0);
    setConnectionLostTimeout(100);
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