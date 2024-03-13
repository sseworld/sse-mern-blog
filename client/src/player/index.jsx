import React, { useEffect } from "react";
import "./main.css";
import Vid from "./assets/Video.mp4";
import Sub from "./assets/subtitles.vtt";
import { AiFillSetting } from "react-icons/ai";

export default function Player() {
  useEffect(() => {
    let playPauseBtn = document.querySelector(".play-pause-btn");
    let theaterBtn = document.querySelector(".theater-btn");
    let fullScreenBtn = document.querySelector(".full-screen-btn");
    let miniPlayerBtn = document.querySelector(".mini-player-btn");
    let muteBtn = document.querySelector(".mute-btn");
    let captionsBtn = document.querySelector(".captions-btn");
    let speedBtn = document.querySelector(".speed-btn");
    let currentTimeElem = document.querySelector(".current-time");
    let totalTimeElem = document.querySelector(".total-time");
    // let previewImg = document.querySelector(".preview-img");
    let thumbnailImg = document.querySelector(".thumbnail-img");
    let volumeSlider = document.querySelector(".volume-slider");
    let videoContainer = document.querySelector(".video-container");
    let timelineContainer = document.querySelector(".timeline-container");
    let video = document.querySelector("video");

    document.addEventListener("keydown", (e) => {
      const tagName = document.activeElement.tagName.toLowerCase();
      if (tagName === "input") return;
      switch (e.key.toLowerCase()) {
        case " ":
          if (tagName === "button") return;
        case "k":
          togglePlay();
          break;
        case "f":
          toggleFullScreenMode();
          break;
        case "t":
          toggleTheaterMode();
          break;
        case "i":
          toggleMiniPlayerMode();
          break;
        case "m":
          toggleMute();
          break;
        case "arrowleft":
        case "j":
          skip(-5);
          break;
        case "arrowright":
        case "l":
          skip(5);
          break;
        case "c":
          toggleCaptions();
          break;
      }
    });

    // Timeline
    timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
    timelineContainer.addEventListener("mousedown", toggleScrubbing);
    document.addEventListener("mouseup", (e) => {
      if (isScrubbing) toggleScrubbing(e);
    });
    document.addEventListener("mousemove", (e) => {
      if (isScrubbing) handleTimelineUpdate(e);
    });

    let isScrubbing = false;
    let wasPaused;
    function toggleScrubbing(e) {
      const rect = timelineContainer.getBoundingClientRect();
      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
      isScrubbing = (e.buttons & 1) === 1;
      videoContainer.classList.toggle("scrubbing", isScrubbing);
      if (isScrubbing) {
        wasPaused = video.paused;
        video.pause();
      } else {
        video.currentTime = percent * video.duration;
        if (!wasPaused) video.play();
      }

      handleTimelineUpdate(e);
    }

    function handleTimelineUpdate(e) {
      const rect = timelineContainer.getBoundingClientRect();
      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
      const previewImgNumber = Math.max(
        1,
        Math.floor((percent * video.duration) / 10)
      );
      const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`;
      // previewImg.src = previewImgSrc;
      timelineContainer.style.setProperty("--preview-position", percent);

      if (isScrubbing) {
        e.preventDefault();
        thumbnailImg.src = previewImgSrc;
        timelineContainer.style.setProperty("--progress-position", percent);
      }
    }

    // Playback Speed
    speedBtn.addEventListener("click", changePlaybackSpeed);

    function changePlaybackSpeed() {
      let newPlaybackRate = video.playbackRate + 0.25;
      if (newPlaybackRate > 2) newPlaybackRate = 0.25;
      video.playbackRate = newPlaybackRate;
      speedBtn.textContent = `${newPlaybackRate}x`;
    }

    // Captions
    const captions = video.textTracks[0];
    captions.mode = "hidden";

    captionsBtn.addEventListener("click", toggleCaptions);

    function toggleCaptions() {
      const isHidden = captions.mode === "hidden";
      captions.mode = isHidden ? "showing" : "hidden";
      videoContainer.classList.toggle("captions", isHidden);
    }

    // Duration
    video.addEventListener("loadeddata", () => {
      totalTimeElem.textContent = formatDuration(video.duration);
    });

    video.addEventListener("timeupdate", () => {
      currentTimeElem.textContent = formatDuration(video.currentTime);
      const percent = video.currentTime / video.duration;
      timelineContainer.style.setProperty("--progress-position", percent);
    });

    const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 2,
    });
    function formatDuration(time) {
      const seconds = Math.floor(time % 60);
      const minutes = Math.floor(time / 60) % 60;
      const hours = Math.floor(time / 3600);
      if (hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
      } else {
        return `${hours}:${leadingZeroFormatter.format(
          minutes
        )}:${leadingZeroFormatter.format(seconds)}`;
      }
    }

    function skip(duration) {
      video.currentTime += duration;
    }

    // Volume
    muteBtn.addEventListener("click", toggleMute);
    volumeSlider.addEventListener("input", (e) => {
      video.volume = e.target.value;
      video.muted = e.target.value === 0;
    });

    function toggleMute() {
      video.muted = !video.muted;
    }

    video.addEventListener("volumechange", () => {
      volumeSlider.value = video.volume;
      let volumeLevel;
      if (video.muted || video.volume === 0) {
        volumeSlider.value = 0;
        volumeLevel = "muted";
      } else if (video.volume >= 0.5) {
        volumeLevel = "high";
      } else {
        volumeLevel = "low";
      }

      videoContainer.dataset.volumeLevel = volumeLevel;
    });

    // View Modes
    theaterBtn.addEventListener("click", toggleTheaterMode);
    fullScreenBtn.addEventListener("click", toggleFullScreenMode);
    miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode);

    function toggleTheaterMode() {
      videoContainer.classList.toggle("theater");
    }

    function toggleFullScreenMode() {
      if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }

    function toggleMiniPlayerMode() {
      if (videoContainer.classList.contains("mini-player")) {
        document.exitPictureInPicture();
      } else {
        video.requestPictureInPicture();
      }
    }

    document.addEventListener("fullscreenchange", () => {
      videoContainer.classList.toggle(
        "full-screen",
        document.fullscreenElement
      );
    });

    video.addEventListener("enterpictureinpicture", () => {
      videoContainer.classList.add("mini-player");
    });

    video.addEventListener("leavepictureinpicture", () => {
      videoContainer.classList.remove("mini-player");
    });

    // Play/Pause
    playPauseBtn.addEventListener("click", togglePlay);
    video.addEventListener("click", togglePlay);

    function togglePlay() {
      video.paused ? video.play() : video.pause();
    }

    video.addEventListener("play", () => {
      videoContainer.classList.remove("paused");
    });

    video.addEventListener("pause", () => {
      videoContainer.classList.add("paused");
    });
  }, []);

  return (
    <div className="video-container paused" data-volume-level="high">
      <img className="thumbnail-img" />
      <div className="video-controls-container">
        <div className="timeline-container">
          <div className="timeline">
            {/* <img className="preview-img" /> */}
            <div className="thumb-indicator"></div>
          </div>
        </div>
        <div className="controls">
          <button className="play-pause-btn">
            <svg className="play-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
            <svg className="pause-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
          </button>
          <div className="volume-container">
            <button className="mute-btn">
              <svg className="volume-high-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
                />
              </svg>
              <svg className="volume-low-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
                />
              </svg>
              <svg className="volume-muted-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
                />
              </svg>
            </button>
            <input
              className="volume-slider"
              type="range"
              min="0"
              max="1"
              step="any"
              value="1"
            />
          </div>
          <div className="duration-container">
            <div className="current-time">0:00</div>/
            <div className="total-time"></div>
          </div>
          <button className="captions-btn">
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z"
              />
            </svg>
          </button>
          <button className="speed-btn wide-btn">1x</button>
          <button className="mini-player-btn">
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"
              />
            </svg>
          </button>
          <button className="theater-btn">
            <svg className="tall" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"
              />
            </svg>
            <svg className="wide" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"
              />
            </svg>
          </button>
          <button className="full-screen-btn">
            <svg className="open" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
              />
            </svg>
            <svg className="close" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
              />
            </svg>
          </button>
          <button className="settingM">
            <AiFillSetting />
            {/* <AiOutlineRadiusSetting /> */}
            {/* <svg className="setting" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                // d="M396 140h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-44 684h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm524-204h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM192 344h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 160h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 160h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 160h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm320 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm160 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm140-284c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V370c0-127-103-230-230-230H484c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h170c87.3 0 158 70.7 158 158v170zM236 96H92c-4.4 0-8 3.6-8 8v144c0 4.4 3.6 8 8 8h144c4.4 0 8-3.6 8-8V104c0-4.4-3.6-8-8-8zm-48 101.6c0 1.3-1.1 2.4-2.4 2.4h-43.2c-1.3 0-2.4-1.1-2.4-2.4v-43.2c0-1.3 1.1-2.4 2.4-2.4h43.2c1.3 0 2.4 1.1 2.4 2.4v43.2zM920 780H776c-4.4 0-8 3.6-8 8v144c0 4.4 3.6 8 8 8h144c4.4 0 8-3.6 8-8V788c0-4.4-3.6-8-8-8zm-48 101.6c0 1.3-1.1 2.4-2.4 2.4h-43.2c-1.3 0-2.4-1.1-2.4-2.4v-43.2c0-1.3 1.1-2.4 2.4-2.4h43.2c1.3 0 2.4 1.1 2.4 2.4v43.2z"
              />
            </svg> */}
          </button>
        </div>
      </div>
      <video src={Vid}>
        <track kind="captions" srcLang="en" src={Sub} />
      </video>
    </div>
  );
}

// export default function Player() {
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     setLoading(false);
//   }, []);
//   useEffect(() => {
//     const playPauseBtn = document.querySelector(".play-pause-btn");
//     const theaterBtn = document.querySelector(".theater-btn");
//     const fullScreenBtn = document.querySelector(".full-screen-btn");
//     const miniPlayerBtn = document.querySelector(".mini-player-btn");
//     const muteBtn = document.querySelector(".mute-btn");
//     const captionsBtn = document.querySelector(".captions-btn");
//     const speedBtn = document.querySelector(".speed-btn");
//     const currentTimeElem = document.querySelector(".current-time");
//     const totalTimeElem = document.querySelector(".total-time");
//     const previewImg = document.querySelector(".preview-img");
//     const thumbnailImg = document.querySelector(".thumbnail-img");
//     const volumeSlider = document.querySelector(".volume-slider");
//     const videoContainer = document.querySelector(".video-container");
//     const timelineContainer = document.querySelector(".timeline-container");
//     const video = document.querySelector("video");

//     document.addEventListener("keydown", (e) => {
//       const tagName = document.activeElement.tagName.toLowerCase();

//       if (tagName === "input") return;

//       switch (e.key.toLowerCase()) {
//         case " ":
//           if (tagName === "button") return;
//         case "k":
//           togglePlay();
//           break;
//         case "f":
//           toggleFullScreenMode();
//           break;
//         case "t":
//           toggleTheaterMode();
//           break;
//         case "i":
//           toggleMiniPlayerMode();
//           break;
//         case "m":
//           toggleMute();
//           break;
//         case "arrowleft":
//         case "j":
//           skip(-5);
//           break;
//         case "arrowright":
//         case "l":
//           skip(5);
//           break;
//         case "c":
//           toggleCaptions();
//           break;
//       }
//     });

//     // Timeline
//     timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
//     timelineContainer.addEventListener("mousedown", toggleScrubbing);
//     document.addEventListener("mouseup", (e) => {
//       if (isScrubbing) toggleScrubbing(e);
//     });
//     document.addEventListener("mousemove", (e) => {
//       if (isScrubbing) handleTimelineUpdate(e);
//     });

//     let isScrubbing = false;
//     let wasPaused;
//     function toggleScrubbing(e) {
//       const rect = timelineContainer.getBoundingClientRect();
//       const percent =
//         Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
//       isScrubbing = (e.buttons & 1) === 1;
//       videoContainer.classList.toggle("scrubbing", isScrubbing);
//       if (isScrubbing) {
//         wasPaused = video.paused;
//         video.pause();
//       } else {
//         video.currentTime = percent * video.duration;
//         if (!wasPaused) video.play();
//       }

//       handleTimelineUpdate(e);
//     }

//     function handleTimelineUpdate(e) {
//       const rect = timelineContainer.getBoundingClientRect();
//       const percent =
//         Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
//       const previewImgNumber = Math.max(
//         1,
//         Math.floor((percent * video.duration) / 10)
//       );
//       const previewImgSrc = `/src/player/assets/previewImgs/preview${previewImgNumber}.jpg`;
//       previewImg.src = previewImgSrc;
//       timelineContainer.style.setProperty("--preview-position", percent);

//       if (isScrubbing) {
//         e.preventDefault();
//         thumbnailImg.src = previewImgSrc;
//         timelineContainer.style.setProperty("--progress-position", percent);
//       }
//     }

//     // Playback Speed
//     speedBtn.addEventListener("click", changePlaybackSpeed);

//     function changePlaybackSpeed() {
//       let newPlaybackRate = video.playbackRate + 0.25;
//       if (newPlaybackRate > 2) newPlaybackRate = 0.25;
//       video.playbackRate = newPlaybackRate;
//       speedBtn.textContent = `${newPlaybackRate}x`;
//     }

//     // Captions
//     const captions = video.textTracks[0];
//     captions.mode = "hidden";

//     captionsBtn.addEventListener("click", toggleCaptions);

//     function toggleCaptions() {
//       const isHidden = captions.mode === "hidden";
//       captions.mode = isHidden ? "showing" : "hidden";
//       videoContainer.classList.toggle("captions", isHidden);
//     }

//     // Duration
//     video.addEventListener("loadeddata", () => {
//       totalTimeElem.textContent = formatDuration(video.duration);
//     });

//     video.addEventListener("timeupdate", () => {
//       currentTimeElem.textContent = formatDuration(video.currentTime);
//       const percent = video.currentTime / video.duration;
//       timelineContainer.style.setProperty("--progress-position", percent);
//     });

//     const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
//       minimumIntegerDigits: 2,
//     });
//     function formatDuration(time) {
//       const seconds = Math.floor(time % 60);
//       const minutes = Math.floor(time / 60) % 60;
//       const hours = Math.floor(time / 3600);
//       if (hours === 0) {
//         return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
//       } else {
//         return `${hours}:${leadingZeroFormatter.format(
//           minutes
//         )}:${leadingZeroFormatter.format(seconds)}`;
//       }
//     }

//     function skip(duration) {
//       video.currentTime += duration;
//     }

//     // Volume
//     muteBtn.addEventListener("click", toggleMute);
//     volumeSlider.addEventListener("input", (e) => {
//       video.volume = e.target.value;
//       video.muted = e.target.value === 0;
//     });

//     function toggleMute() {
//       video.muted = !video.muted;
//     }

//     video.addEventListener("volumechange", () => {
//       volumeSlider.value = video.volume;
//       let volumeLevel;
//       if (video.muted || video.volume === 0) {
//         volumeSlider.value = 0;
//         volumeLevel = "muted";
//       } else if (video.volume >= 0.5) {
//         volumeLevel = "high";
//       } else {
//         volumeLevel = "low";
//       }

//       videoContainer.dataset.volumeLevel = volumeLevel;
//     });

//     // View Modes
//     theaterBtn.addEventListener("click", toggleTheaterMode);
//     fullScreenBtn.addEventListener("click", toggleFullScreenMode);
//     miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode);

//     function toggleTheaterMode() {
//       videoContainer.classList.toggle("theater");
//     }

//     function toggleFullScreenMode() {
//       if (document.fullscreenElement == null) {
//         videoContainer.requestFullscreen();
//       } else {
//         document.exitFullscreen();
//       }
//     }

//     function toggleMiniPlayerMode() {
//       if (videoContainer.classList.contains("mini-player")) {
//         document.exitPictureInPicture();
//       } else {
//         video.requestPictureInPicture();
//       }
//     }

//     document.addEventListener("fullscreenchange", () => {
//       videoContainer.classList.toggle(
//         "full-screen",
//         document.fullscreenElement
//       );
//     });

//     video.addEventListener("enterpictureinpicture", () => {
//       videoContainer.classList.add("mini-player");
//     });

//     video.addEventListener("leavepictureinpicture", () => {
//       videoContainer.classList.remove("mini-player");
//     });

//     // Play/Pause
//     playPauseBtn.addEventListener("click", togglePlay);
//     video.addEventListener("click", togglePlay);

//     function togglePlay() {
//       video.paused ? video.play() : video.pause();
//     }

//     video.addEventListener("play", () => {
//       videoContainer.classList.remove("paused");
//     });

//     video.addEventListener("pause", () => {
//       videoContainer.classList.add("paused");
//     });
//   }, [loading]);
//   // useEffect(() => {
//   //   const script = document.createElement("script");
//   //   script.src = "/src/player/script.js";
//   //   script.async = true;
//   //   document.body.appendChild(script);
//   //   return () => {
//   //     document.body.removeChild(script);
//   //   };
//   // }, []);
//   // console.log(document.getElementsByClassName("video-container"));
//   // console.log(document.querySelector('button.play-pause-btn'));
//   // console.log(document.querySelector('button.play-pause-btn'));

//   return (
//     <div className="video-container paused" data-volume-level="high">
//       <img className="thumbnail-img" />
//       <div className="video-controls-container">
//         <div className="timeline-container">
//           <div className="timeline">
//             <img className="preview-img" />
//             <div className="thumb-indicator"></div>
//           </div>
//         </div>
//         <div className="controls">
//           <button className="play-pause-btn">
//             <svg className="play-icon" viewBox="0 0 24 24">
//               <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
//             </svg>
//             <svg className="pause-icon" viewBox="0 0 24 24">
//               <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
//             </svg>
//           </button>
//           <div className="volume-container">
//             <button className="mute-btn">
//               <svg className="volume-high-icon" viewBox="0 0 24 24">
//                 <path
//                   fill="currentColor"
//                   d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
//                 />
//               </svg>
//               <svg className="volume-low-icon" viewBox="0 0 24 24">
//                 <path
//                   fill="currentColor"
//                   d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
//                 />
//               </svg>
//               <svg className="volume-muted-icon" viewBox="0 0 24 24">
//                 <path
//                   fill="currentColor"
//                   d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
//                 />
//               </svg>
//             </button>
//             <input
//               className="volume-slider"
//               type="range"
//               min="0"
//               max="1"
//               step="any"
//               value="1"
//             />
//           </div>
//           <div className="duration-container">
//             <div className="current-time">0:00</div>/
//             <div className="total-time"></div>
//           </div>
//           <button className="captions-btn">
//             <svg viewBox="0 0 24 24">
//               <path
//                 fill="currentColor"
//                 d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z"
//               />
//             </svg>
//           </button>
//           <button className="speed-btn wide-btn">1x</button>
//           <button className="mini-player-btn">
//             <svg viewBox="0 0 24 24">
//               <path
//                 fill="currentColor"
//                 d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"
//               />
//             </svg>
//           </button>
//           <button className="theater-btn">
//             <svg className="tall" viewBox="0 0 24 24">
//               <path
//                 fill="currentColor"
//                 d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"
//               />
//             </svg>
//             <svg className="wide" viewBox="0 0 24 24">
//               <path
//                 fill="currentColor"
//                 d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"
//               />
//             </svg>
//           </button>
//           <button className="full-screen-btn">
//             <svg className="open" viewBox="0 0 24 24">
//               <path
//                 fill="currentColor"
//                 d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
//               />
//             </svg>
//             <svg className="close" viewBox="0 0 24 24">
//               <path
//                 fill="currentColor"
//                 d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//       <video src={Vid}>
//         <track kind="captions" srcLang="en" src="assets/subtitles.vtt" />
//       </video>
//     </div>
//   );
// }
