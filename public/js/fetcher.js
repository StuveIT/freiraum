export function fetchXML(url, entryMap, method = 'GET', signal = AbortSignal.timeout(5000)) {
  /**
   * Fetches XML data from a given URL and processes it.
   * @param {string} url - The URL to fetch the XML from.
   * @param {function} entryMap - A function to map the XML entries to a desired format.
   * @param {string} [method='GET'] - The HTTP method to use for the request.
   * @param {AbortSignal} [signal] - An optional AbortSignal to cancel the request.
   * @returns {Promise<any>} A promise that resolves with the processed data.
   */
  const options = {
    method: method,
    headers: {
      'Accept': 'application/atom+xml, application/xml, text/xml'
    },
    cache: 'no-cache',
    signal: signal
  };

  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(xmlString => {
      // Check if the response is empty
      if (!xmlString.trim()) {
        throw new Error("Empty XML response");
      }

      // Validate XML format
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");

      // Extract the entries
      const entries = xmlDoc.querySelectorAll('entry');

      // Define namespaces
      const atomNS = "http://www.w3.org/2005/Atom";
      const mNS = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";
      const dNS = "http://schemas.microsoft.com/ado/2007/08/dataservices";

      // Instantiate an empty array to hold the entry data
      const data = [];

      // Process each entry
      entries.forEach(entry => {
        // To get <content> (in default namespace):
        const content = entry.getElementsByTagNameNS(atomNS, "content")[0];
        const properties = content.getElementsByTagNameNS(mNS, "properties")[0];

        // Extract data from each entry
        data.push(entryMap(properties, {
          atom: atomNS,
          metadata: mNS,
          data: dNS,
        }));
      });

      return data;
    });
}
