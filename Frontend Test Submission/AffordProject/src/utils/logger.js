const LOG_API_ENDPOINT = 'http://120.244.56.144/evaluation-service/logs';


export const log = async (level, pkg, message) => {
  const body = {
    stack: 'frontend',
    level: level,
    message: message,
  };

  try {
    const response = await fetch(LOG_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('LOGGING FAILED:', `Status ${response.status}`, await response.text());
      return;
    }

    const result = await response.json();
    console.log(`Log sent successfully, ID: ${result.logId}`);
    
  } catch (error) {
    console.error('Network error while trying to send log:', error);
  }
};