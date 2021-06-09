window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then(
      function (response) {
        console.log("Registration Successful", response);
      },
      function (error) {
        console.log("Registration Failed", error);
      }
    );
  }
});
