/**
 * 
 */
package com.ibm.xsp.extlib.config;

import com.ibm.xsp.extlib.proxy.ProxyHandlerFactory;
import com.ibm.xsp.extlib.sbt.connections.proxy.ConnectionsProxyHandler;
import com.ibm.xsp.extlib.sbt.files.proxy.FileHandler;

/**
 * @author Andrejus Chaliapinas
 *
 */
public class SBTConfig extends ExtlibPluginConfig {
	public SBTConfig() {
	    // Install the proxy handler for files
	    ProxyHandlerFactory.get().registerHandler(FileHandler.URL_PATH, FileHandler.class);
        ProxyHandlerFactory.get().registerHandler(ConnectionsProxyHandler.URL_PATH, ConnectionsProxyHandler.class);
	}

	
	// ===============================================================
	// 	Compose the lists of extra config files 
	// ===============================================================
	
	@Override
	public String[] getXspConfigFiles(String[] files) {
		return concat(files, new String[] {
				"com/ibm/xsp/extlib/config/extlib-sbt.xsp-config", // $NON-NLS-1$
                "com/ibm/xsp/extlib/config/extlib-sbt-sametime.xsp-config", // $NON-NLS-1$
                "com/ibm/xsp/extlib/config/extlib-sbt-connections.xsp-config", // $NON-NLS-1$
                "com/ibm/xsp/extlib/config/extlib-sbt-util.xsp-config", // $NON-NLS-1$
		});
	}

	@Override
	public String[] getFacesConfigFiles(String[] files) {
		return concat(files, new String[] {
				"com/ibm/xsp/extlib/config/extlib-sbt-faces-config.xml", // $NON-NLS-1$
                "com/ibm/xsp/extlib/config/extlib-sbt-sametime-faces-config.xml", // $NON-NLS-1$
                "com/ibm/xsp/extlib/config/extlib-sbt-connections-faces-config.xml", // $NON-NLS-1$
		});
	}
}
