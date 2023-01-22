import elasticsearch_spec_data from "./schema_minify.json";

export type Spec = {
  since: string
  name: string
  docUrl: string
  urlPaths: string
  description: string
  stability: string
  visibility: string
}

const newSpec = (d): Spec => {
  let since = "";
  if (d.since !== undefined && d.since !== "") {
    since = String(d.since);
  }

  let name = "";
  if (d.docId !== undefined && d.docId !== null && d.docId !== "") {
    name = d.docId;
  } else if (d.docUrl !== undefined && d.docUrl !== null) {
    let result = String(d.docUrl).match(/.*\/(.*).html/);
    if (result !== null && result.length == 2) {
      name = result[1];
    }
  }

  let docUrl = "";
  if (d.docUrl !== undefined && d.docUrl !== null) {
    docUrl = String(d.docUrl).replace(/{branch}/, "current").replace(/\/master\//, "/current/");
  }

  let deprecatedVersion = new Map<string, string>();
  d.urls.map((url) => {
      if (
        url.deprecation !== undefined &&
        url.deprecation.version !== ""
      ) {
        deprecatedVersion.set(url.methods + " " + url.path, url.deprecation.version);
      }
      return null;
    })
  ;

  const urlPaths = d.urls.map((url) => {
    if (
      url.path !== undefined &&
      url.path !== ""
    ) {
      let key = url.methods + " " + url.path;
      let val = key;
      if (deprecatedVersion !== null && deprecatedVersion.size > 0) {
        let version = deprecatedVersion.get(key);
        if (version !== undefined) {
          val += " (deprecated in " + version + ")";
        }
      }
      return  val;
    }
    return null;
  });


  return {
    since: since,
    name: name,
    docUrl: docUrl,
    urlPaths: urlPaths.join("<br/>"),
    description: d.description,
    stability: d.stability,
    visibility: d.visibility
  }
}

export function makeSpecData() {
  return elasticsearch_spec_data.endpoints.map((d): Spec => {return {...newSpec(d)}})
}