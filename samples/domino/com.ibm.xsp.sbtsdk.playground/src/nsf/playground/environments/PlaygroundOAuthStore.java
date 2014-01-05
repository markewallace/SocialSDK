package nsf.playground.environments;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.ibm.sbt.opensocial.domino.oauth.DominoOAuthClient;
import com.ibm.sbt.opensocial.domino.oauth.DominoOAuthClient.KeyType;
import com.ibm.sbt.opensocial.domino.oauth.DominoOAuthStore;
import com.ibm.xsp.sbtsdk.playground.sbt.extension.SbtEndpoints;

/**
 * An OpenSocial OAuth 1.0a store.
 *
 */
public class PlaygroundOAuthStore implements DominoOAuthStore {
	private static final String DEFAULT_SC_SERVICE_NAME = "smartcloud";
	private Map<String, DominoOAuthClient> clients;
	
	/**
	 * Creates an OpenSocial 1.0a store from an environment.
	 * @param env The environment to create the store from.
	 */
	public PlaygroundOAuthStore(PlaygroundEnvironment env) {
		clients = new HashMap<String, DominoOAuthClient>();
		populateOAuthClients(env.getFieldMap());
	}

	private void populateOAuthClients(Map<String, String> fieldMap) {
		clients.put(StringUtils.defaultString(StringUtils.trim(fieldMap.get(SbtEndpoints.SMA_OA_GADGET_SERVICE)), DEFAULT_SC_SERVICE_NAME), 
				createSmartCloudClient(fieldMap));
		
	}

	private DominoOAuthClient createSmartCloudClient(
			Map<String, String> fieldMap) {
		DominoOAuthClient client = new DominoOAuthClient();
		client.setConsumerKey(StringUtils.trim(fieldMap.get(SbtEndpoints.SMA_OA_COUNSUMERKEY)));
		client.setConsumerSecret(StringUtils.trim(fieldMap.get(SbtEndpoints.SMA_OA_CONSUMERSECRET)));
		client.setKeyType(KeyType.PLAINTEXT);
		client.setForceCallbackOverHttps(true);
		return client;
	}

	@Override
	public DominoOAuthClient getClient(String user, String container,
			String service, String gadgetUri) {
		return clients.get(service);
	}
}
