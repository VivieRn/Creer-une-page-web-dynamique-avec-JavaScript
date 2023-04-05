export function setCookie(name, value, expirationInHours) {
  var expires = "";
  if (expirationInHours) {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + expirationInHours * 60 * 60 * 1000;
    now.setTime(expireTime);
    expires = "; expires=" + now.toUTCString() + ";";
    expires += " sameSite=none;";
    expires += " secure";
  }

  document.cookie = name + "=" + (value || "") + expires;
}
