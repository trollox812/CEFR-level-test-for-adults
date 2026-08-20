module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: "error", message: "Method not allowed." }));
    return;
  }

  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL || "";

  if (!googleScriptUrl) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: "error", message: "Results storage is not configured." }));
    return;
  }

  try {
    const payload =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body && typeof req.body === "object"
          ? req.body
          : {};

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const rawText = await response.text();
    let result = null;

    try {
      result = rawText ? JSON.parse(rawText) : null;
    } catch (parseError) {
      result = null;
    }

    if (!response.ok) {
      res.statusCode = response.status;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          status: "error",
          message: "Google Sheets returned HTTP " + response.status + "."
        })
      );
      return;
    }

    if (!result || (result.status !== "success" && result.ok !== true)) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          status: "error",
          message:
            result && result.message
              ? result.message
              : "Google Sheets did not confirm that the result was saved."
        })
      );
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "error",
        message: error && error.message ? error.message : "Submission failed."
      })
    );
  }
};
