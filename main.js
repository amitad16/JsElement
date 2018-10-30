if (!window.jQuery) {
  alert("Plese add jQuery");
}
/**
 * takes domain name, lat, lng and tags and send them to server
 * @param {Array} tags tags to be set by the website admin
 */
const sendTags = tags => {
  let location = [];

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoordinates, showError);
    } else {
      alert("Geolocation is not supported by this browser");
    }
  }

  function getCoordinates(position) {
    let lat = position.coords.longitude;
    let lng = position.coords.latitude;

    $.ajax({
      method: "post",
      url: "http://localhost:5000/getSite",
      data: { tags, lat, lng },
      success: function(res) {
        console.log(res);

        const setStylesOnElement = (element, styles) => {
          Object.assign(element.style, styles);
        };

        // Get body tag
        let body = document.querySelector("body");

        // Create an Ad wrapper
        let adWrapper = document.createElement("DIV");

        // assign attributes to Ad wrapper
        adWrapper.classList.add("ad-wrapper");
        adWrapper.setAttribute("onload", "loadAd()");

        /* create children of ad wrapper */
        // create upper text
        let closeIconWrapper = document.createElement("DIV");
        let mainTextWrapper = document.createElement("DIV");
        let actionWrapper = document.createElement("DIV");
        let descriptionTextWrapper = document.createElement("DIV");

        // Add classes to child componetns
        closeIconWrapper.classList.add("ad-wrapper__close-wrapper");
        mainTextWrapper.classList.add("ad-wrapper__main-text-wrapper");
        actionWrapper.classList.add("ad-wrapper__action-wrapper");
        descriptionTextWrapper.classList.add("ad-wrapper__description-wrapper");

        // Close icon wrapper
        closeIconWrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" width="0.93em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1216 1312"><path d="M1202 1066q0 40-28 68l-136 136q-28 28-68 28t-68-28L608 976l-294 294q-28 28-68 28t-68-28L42 1134q-28-28-28-68t28-68l294-294L42 410q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68L880 704l294 294q28 28 28 68z" fill="#626262"/></svg>`;

        // Main Text Wrapper
        mainTextWrapper.innerHTML = `<p class='ad-wrapper__main-text'>There are more options for you</p>`;

        // action wrapper
        actionWrapper.innerHTML = `<a href='/' class='ad-wrapper__action' target="_blank">Yes</a><a href='/' class='ad-wrapper__action'>No</a>`;

        // description wrapper
        descriptionTextWrapper.innerHTML = `<p class='ad-wrapper__description-text'>This is some description</p>`;

        // Add styles
        setStylesOnElement(adWrapper, {
          position: "absolute",
          "z-index": "10000",
          top: "0",
          right: "0",
          padding: "16px",
          "background-color": "#ebeef0",
          "font-family": "sans-serif",
          "max-width": "300px",
          "box-shadow":
            "0 12px 24px -6px rgba(9,45,66,.25), 0 0 0 1px rgba(9,45,66,.08)",
          "transition-property": "width,-webkit-transform",
          "transition-property": "transform,width",
          "transition-property": "transform,width,-webkit-transform",
          "transition-duration": ".5s",
          "transition-timing-function": "ease-in",
          "-webkit-transform": "translateX(300px)",
          transform: "translateX(300px)"
        });

        setStylesOnElement(closeIconWrapper, {
          "text-align": "right",
          cursor: "pointer"
        });

        setStylesOnElement(mainTextWrapper, { "line-height": "30px" });

        setStylesOnElement(actionWrapper, { "text-align": "center" });

        actionWrapper.querySelectorAll("a.ad-wrapper__action").forEach(e => {
          setStylesOnElement(e, {
            "text-decoration": "none",
            padding: "8px 16px",
            "background-color": "cadetblue",
            "border-radius": "7px",
            color: "#fff",
            "text-transform": "uppercase",
            margin: "0 16px"
          });
        });

        setStylesOnElement(
          descriptionTextWrapper.querySelector(
            "p.ad-wrapper__description-text"
          ),
          {
            "text-align": "center",
            "padding-top": "16px",
            "font-size": ".95em"
          }
        );

        // Add children
        adWrapper.appendChild(closeIconWrapper);
        adWrapper.appendChild(mainTextWrapper);
        adWrapper.appendChild(actionWrapper);
        adWrapper.appendChild(descriptionTextWrapper);

        closeIconWrapper.onclick = () => [
          setStylesOnElement(adWrapper, {
            "-webkit-transform": "translateX(300px)",
            transform: "translateX(300px)"
          })
        ];

        // append element to webpage
        body.appendChild(adWrapper);

        $(".ad-wrapper").animate({ right: "300px" }, 500);

        /**
         *
         * @param {URL} url send url to /adClick
         */
        document
          .querySelector(".ad-wrapper__action")
          .addEventListener("click", e => {
            console.log("e.target.href", e.target.href);
            let url = e.target.href;

            url = url.split("/");

            if (url[url.length - 1] === "") url = url[url.length - 2];
            else url = url[url.length - 1];

            $.ajax({
              method: "post",
              url: "http://localhost:5000/adClick",
              data: { domain: url },
              error: function(err1, err2, err3) {
                console.log("err1", err1);
                console.log("err2", err2);
                console.log("err3", err3);
              }
            });
          });

        document.querySelector(".ad-wrapper__action").setAttribute("href", res);
      },
      error: function(err1, err2, err3) {
        console.log("err1", err1);
        console.log("err2", err2);
        console.log("err3", err3);
      }
    });
  }

  getLocation();
};
