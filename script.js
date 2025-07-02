function calculateDays() {
  const startInput = document.getElementById('start-date').value;
  const endInput = document.getElementById('end-date').value;
  const includeEnd = document.getElementById('include-end').checked;
  const businessDaysOnly = document.getElementById('business-days').checked;
  const resultEl = document.getElementById('result');

  if (!startInput || !endInput) {
    resultEl.textContent = "Please select both dates.";
    return;
  }

  const startDate = new Date(startInput);
  const endDate = new Date(endInput);

  if (isNaN(startDate) || isNaN(endDate)) {
    resultEl.textContent = "Invalid date(s) entered.";
    return;
  }

  // Helper to add ordinal suffix (st, nd, rd, th)
  function ordinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  // Format date as "Jan 6th, 2017"
  function formatDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const suffix = ordinalSuffix(day);
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}${suffix}, ${year}`;
  }

  // Function to count business days between two dates (inclusive/exclusive)
  function countBusinessDays(start, end, includeEndDay) {
    let count = 0;
    const current = new Date(start);
    const endLimit = includeEndDay ? new Date(end) : new Date(end.getTime() - 24*60*60*1000);

    while (current <= endLimit) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) { // 0=Sun, 6=Sat
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  }

  let diffDays;

  if (businessDaysOnly) {
    diffDays = countBusinessDays(startDate, endDate, includeEnd);
  } else {
    const msDiff = endDate.getTime() - startDate.getTime();
    diffDays = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    if (includeEnd) diffDays += 1;
  }

  if (diffDays < 0) {
    resultEl.textContent = "End date must be after start date.";
    return;
  }

  const startFormatted = formatDate(startDate);
  const endFormatted = formatDate(endDate);

  const dayWord = diffDays === 1 ? "day" : "days";

  resultEl.textContent = `There are ${diffDays} ${dayWord} between ${startFormatted} and ${endFormatted}.`;
}
