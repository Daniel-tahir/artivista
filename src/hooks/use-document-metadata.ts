import { useEffect } from "react";

interface UseDocumentMetadataOptions {
  title: string;
  description: string;
}

export const useDocumentMetadata = ({
  title,
  description,
}: UseDocumentMetadataOptions) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const descriptionTag = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    const previousDescription = descriptionTag?.content;

    if (descriptionTag) {
      descriptionTag.content = description;
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    return () => {
      document.title = previousTitle;

      const activeDescriptionTag = document.querySelector(
        'meta[name="description"]',
      ) as HTMLMetaElement | null;

      if (!activeDescriptionTag) {
        return;
      }

      if (previousDescription) {
        activeDescriptionTag.content = previousDescription;
      } else {
        activeDescriptionTag.remove();
      }
    };
  }, [description, title]);
};
