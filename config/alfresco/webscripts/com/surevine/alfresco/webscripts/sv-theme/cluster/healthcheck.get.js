var result = remote.call("/cluster/HealthCheck");

if (result.status != 200) {
	throw "Share is up, but repository health check returned a status of: "+result.status;
}

logger.log("[healthcheck.get.js] status: " + result.status);