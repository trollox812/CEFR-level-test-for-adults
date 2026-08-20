function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(30000);

    const spreadsheet = SpreadsheetApp.openById(
      "1vcL8vs5hXaSzQwnHr0cMOZC9t3ZlCfaI7m5AgUKF56s"
    );
    const sheet = spreadsheet.getSheetByName("Assessment Results") ||
      spreadsheet.insertSheet("Assessment Results");

    const data = JSON.parse(e.postData.contents);

    const headers = [
      "Timestamp",
      "Learner Name",
      "Age",
      "Current Situation",
      "Email",
      "Best Level",
      "Last Passed",
      "Level Failed",
      "A0 Score",
      "A1 Score",
      "A2 Score",
      "B1 Score",
      "B2 Score",
      "Cumulative %",
      "Written Response"
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    } else {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    let scores = {
      A0: "",
      A1: "",
      A2: "",
      B1: "",
      B2: ""
    };

    if (Array.isArray(data.roundScores)) {
      data.roundScores.forEach(r => {
        const code = r.levelCode;
        const total = Number(r.total || 0);
        const correct = Number(r.correct || 0);

        if (scores.hasOwnProperty(code) && total > 0) {
          scores[code] = Math.round((correct / total) * 100) + "%";
        }
      });
    }

    sheet.appendRow([
      new Date(),
      data.learnerName || "",
      data.age || "",
      data.currentSituation || "",
      data.email || "",
      data.bestLevel || "",
      data.lastPassed || "",
      data.levelFailed || "",
      scores.A0,
      scores.A1,
      scores.A2,
      scores.B1,
      scores.B2,
      data.cumulativePercent || "",
      data.writingForMarking || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: err.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}
