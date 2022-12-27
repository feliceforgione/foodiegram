import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

function CopyUrl({ url, linkText = "Copy Link" }) {
  const [urlCopied, setUrlCopied] = React.useState(false);

  return (
    <CopyToClipboard text={url} onCopy={() => setUrlCopied(true)}>
      <span>{urlCopied ? "Copied" : linkText}</span>
    </CopyToClipboard>
  );
}

export default CopyUrl;
