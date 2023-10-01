import { useEffect, useState } from "react";

const useMicFrequency = ({ isEnabled }) => {
  const [micFreq, setMicFreq] = useState(0);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let audioContext = new AudioContext();
    let analyser = audioContext.createAnalyser();
    const mediaStreamConstraints = { audio: true };

    navigator.mediaDevices
      .getUserMedia(mediaStreamConstraints)
      .then((stream) => {
        let microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        analyser.fftSize = 512;
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);

        function updateMicFreq() {
          analyser.getByteFrequencyData(dataArray);

          let sum = dataArray.reduce((acc, val) => acc + val, 0);
          let average = sum / dataArray.length;

          setMicFreq(average);
          requestAnimationFrame(updateMicFreq);
        }

        updateMicFreq();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });

    return () => {
      if (audioContext.state === "running") {
        audioContext.close().catch(console.error);
      }
    };
  }, [isEnabled]);

  return micFreq;
};

export default useMicFrequency;
