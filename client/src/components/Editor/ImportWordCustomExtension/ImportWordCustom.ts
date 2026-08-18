import { ImportWord } from 'reactjs-tiptap-editor/importword';

export const ImportWordCustom = ImportWord.configure({
  upload: async (files: File[]) => {
    const uploaded = await Promise.all(
      files.map(async (file) => {
        try {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });

          return {
            src: base64,
            alt: file.name,
          };
        } catch (err) {
          console.error("Upload image failed", err);
          return {
            src: "",
            alt: file.name,
          };
        }
      })
    );

    return uploaded;
  },
});