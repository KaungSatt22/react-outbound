export const phContact = (code, no) => {
  if (no.startsWith(code)) {
    return no;
  } else {
    const split = no.split(" ");
    if (split.length === 2) {
      return `${code} ` + " " + no.replace(`${split[0]}`, "").trim();
    } else {
      return `${code} ` + no;
    }
  }
};
