import java.net.ServerSocket;
import java.net.Socket;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.util.Map;
import java.util.HashMap;
import java.lang.reflect.Method;

/**
 * Created by yar 09.09.2009
 */

class Pair<A, B> {
	private A first;
	private B second;

	public Pair(A first, B second) {
		super();
		this.first = first;
		this.second = second;
	}

	public int hashCode() {
		int hashFirst = first != null ? first.hashCode() : 0;
		int hashSecond = second != null ? second.hashCode() : 0;

		return (hashFirst + hashSecond) * hashSecond + hashFirst;
	}

	public boolean equals(Object other) {
		if (other instanceof Pair) {
			Pair otherPair = (Pair) other;
			return
					((  this.first == otherPair.first ||
							( this.first != null && otherPair.first != null &&
									this.first.equals(otherPair.first))) &&
							(	this.second == otherPair.second ||
									( this.second != null && otherPair.second != null &&
											this.second.equals(otherPair.second))) );
		}

		return false;
	}

	public String toString()
	{
		return "(" + first + ", " + second + ")";
	}

	public A getFirst() {
		return first;
	}

	public B getSecond() {
		return second;
	}

	public void setFirst(A first) {
		this.first = first;
	}


	public void setSecond(B second) {
		this.second = second;
	}
}

public class ServerVpiski {

	public static void main(String[] args) throws Throwable {
		ServerSocket ss = new ServerSocket(8080);
		while (true) {
			Socket s = ss.accept();
			System.err.println("Client accepted");
			new Thread(new SocketProcessor(s)).start();
		}
	}

	private static class SocketProcessor implements Runnable {

		private Socket s;
		private InputStream is;
		private OutputStream os;
		private String path;

		public static Pair<String, Map<String, String>> parseQuery(String query)
		{
			int lenQuery = query.indexOf("?");
			String paramsString = query.substring(lenQuery + 1);
			String queryString = query.substring(1, lenQuery);
			String[] params = paramsString.split("&");
			Map<String, String> map = new HashMap<String, String>();
			for (String param : params)
			{
				String name = param.split("=")[0];
				String value = param.split("=")[1];
				map.put(name, value);
			}
			return new Pair(queryString, map);
		}

		private SocketProcessor(Socket s) throws Throwable {
			this.s = s;
			this.is = s.getInputStream();
			this.os = s.getOutputStream();
		}

		public void run() {
			try {
				readInputHeaders();
				String text = "Hello!";
				Pair<String, Map<String, String>> query = parseQuery(path);
				writeResponse("<html><body><h1>" + text + " Request: " + query.getFirst() + "</h1></body></html>");
			} catch (Throwable t) {
                /*do nothing*/
			} finally {
				try {
					s.close();
				} catch (Throwable t) {
                    /*do nothing*/
				}
			}
			System.err.println("Client processing finished");
		}

		private void writeResponse(String s) throws Throwable {
			String response = "HTTP/1.1 200 OK\r\n" +
					"Server: YarServer/2009-09-09\r\n" +
					"Content-Type: text/html\r\n" +
					"Content-Length: " + s.length() + "\r\n" +
					"Connection: close\r\n\r\n";
			String result = response + s;
			os.write(result.getBytes());
			os.flush();
		}

		private void readInputHeaders() throws Throwable {
			BufferedReader br = new BufferedReader(new InputStreamReader(is));
			String request = br.readLine(); // Now you get GET index.html HTTP/1.1
			String[] requestParam = request.split(" ");
			path = requestParam[1];
			while(true) {
				String s = br.readLine();
				if(s == null || s.trim().length() == 0) {
					break;
				}
			}
		}
	}
}
