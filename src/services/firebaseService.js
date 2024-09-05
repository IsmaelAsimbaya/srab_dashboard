import { storage } from "/app/src/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const uploadVideoToFirebase = (file, setUploadProgress) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      alert("No se ha proporcionado ningún archivo.");
      return reject(new Error("No file provided"));
    }

    try {
      const storageRef = ref(storage, `videos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error durante la subida del archivo:", error);
          alert("Error durante la subida del archivo. Revisa la consola para más detalles.");
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            alert("Subida de video completada exitosamente.");
            resolve(downloadURL);
          } catch (error) {
            console.error("Error al obtener la URL de descarga:", error);
            alert("Error al obtener la URL de descarga.");
            reject(error);
          }
        }
      );
    } catch (error) {
      console.error("Error en uploadVideoToFirebase:", error);
      alert("Error al iniciar la subida del video.");
      reject(error);
    }
  });
};