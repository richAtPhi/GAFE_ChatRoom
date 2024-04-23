document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("sendGift").addEventListener("click", showTipHolder);
  document.getElementById("closeGift").addEventListener("click", hideTipHolder);

  function showTipHolder() {
    const tipHover = document.getElementById("tipHover");
    if (tipHover.style.display === "block") {
      document.getElementById("tipHover").style.display = "none";
    } else {
      document.getElementById("tipHover").style.display = "block";
    }
  }

  function hideTipHolder() {
    document.getElementById("tipHover").style.display = "none";
  }
});
