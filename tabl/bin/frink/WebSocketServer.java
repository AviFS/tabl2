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

public class WS extends WebSocketServer {

  public WS(int port) throws UnknownHostException {
    super(new InetSocketAddress(port));
  }

  public WS(InetSocketAddress address) {
    super(address);
  }

  public WS(int port, Draft_6455 draft) {
    super(new InetSocketAddress(port), Collections.<Draft>singletonList(draft));
  }

  @Override
  public void onOpen(WebSocket conn, ClientHandshake handshake) {
  }

  @Override
  public void onClose(WebSocket conn, int code, String reason, boolean remote) {
  }

  @Override
  public void onMessage(WebSocket conn, String message) {
    conn.send("! "+message);
  }

  @Override
  public void onMessage(WebSocket conn, ByteBuffer message) {
      onMessage(conn, message.array().toString());
  }

  @Override
  public void onError(WebSocket conn, Exception ex) {
    ex.printStackTrace();
  }

}