import { FC, useCallback, useEffect } from "react";
import { fabric } from "fabric";
import { useMoralis, useNFTBalances } from "react-moralis";
import { Button, TextInput } from "nes-react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { getColorFilter } from "./helper";
import { useState } from "react";
import { displayName, findFortress } from "../../metadata";

const Editor: FC = () => {
  const { authenticate, isAuthenticated } = useMoralis();

  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => authenticate()}>Authenticate</button>
      </div>
    );
  }
  return <AuthenticatedView />;
};

const AuthenticatedView: FC = () => {
  const [x, setX] = useState("1");
  const [y, setY] = useState("0");
  const [label, setLabel] = useState<fabric.Text>();
  const handleXChange = useCallback((e) => setX(e.target.value), []);
  const handleYChange = useCallback((e) => setY(e.target.value), []);

  const { data, error } = useNFTBalances();
  console.log("moralis error", error);

  const { editor, onReady } = useFabricJSEditor();

  useEffect(() => {
    if (editor?.canvas.getObjects().length === 0) {
      const grad = new fabric.Gradient({
        type: "linear",
        coords: {
          x1: -(editor?.canvas.width ?? 0) / 2,
          y1: 0,
          x2: editor?.canvas.width ?? 0 / 2,
          y2: 0,
        },
        colorStops: [
          {
            color: "#D6F185",
            offset: 0,
          },
          {
            color: "grey",
            offset: 1,
          },
        ],
      });

      editor?.canvas.setBackgroundColor(grad, () => {});
      fabric.Image.fromURL("/assets/castle.png", (oImg) => {
        const scale = 450 / (oImg.width ?? 100);

        const img1 = oImg.set({
          scaleX: scale,
          scaleY: scale,
        });
        editor?.canvas.add(img1);
        editor?.canvas.centerObject(img1);
      });
    }
  }, [editor]);

  useEffect(() => {
    const castleName = displayName(findFortress(x, y)?.name ?? "");
    if (editor?.canvas != null && label == null) {
      const castleName = displayName(findFortress(x, y)?.name ?? "");
      const tempLabel = new fabric.Text(castleName, {
        fontFamily: "Press Start 2P",
        fontSize: 28,
        top: 20,
      });
      setLabel(tempLabel);
    }
    if (label != null) {
      label.set("text", castleName);
      editor?.canvas.add(label);
      editor?.canvas.centerObjectH(label);
    }
  }, [x, y, label, editor, editor?.canvas]);

  return (
    <>
      <FabricJSCanvas className="sample-canvas" onReady={onReady} />
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          // @ts-ignore
          onClick={() => {
            editor?.canvas.remove(editor?.canvas.getActiveObject());
          }}
        >
          Delete Selection
        </Button>
        <Button
          // @ts-ignore
          onClick={() => {
            editor?.canvas.discardActiveObject();
            editor?.canvas.getElement().toBlob((blob) => {
              const blobUrl = URL.createObjectURL(blob!);
              const link = document.createElement("a");
              link.href = blobUrl;
              link.download = "banner.png";
              document.body.appendChild(link);
              link.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                })
              );
              document.body.removeChild(link);
            });
          }}
        >
          Save Image
        </Button>
        X Coordinate
        <TextInput
          style={{ width: 100 }}
          value={x as string}
          onChange={handleXChange as () => void}
        />
        Y Coordinate
        <TextInput
          style={{ width: 100 }}
          value={y as string}
          onChange={handleYChange as () => void}
        />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {data != null &&
          data.result != null &&
          data.result
            .filter((nft) => nft.metadata != null && nft.metadata.image != null)
            .map((nftWithImage) => {
              let imageUrl = nftWithImage.metadata.image as string;
              if (nftWithImage.metadata.image.startsWith("ipfs")) {
                imageUrl =
                  "https://gateway.ipfs.io/ipfs/" +
                  imageUrl.split("ipfs://")[1];
                imageUrl = imageUrl.replace("/ipfs/ipfs/", "/ipfs/");
              }
              return (
                <div
                  style={{ width: 100, padding: 10 }}
                  onClick={() => {
                    fabric.Image.fromURL(
                      imageUrl,
                      (oImg) => {
                        const scale = 200 / (oImg.width ?? 100);

                        var img1 = oImg.set({
                          scaleX: scale,
                          scaleY: scale,
                        });

                        if (isWizards(nftWithImage.token_address)) {
                          removeWizardsBackground(img1);
                        }
                        editor?.canvas.add(img1);
                        editor?.canvas.centerObject(img1);
                      },
                      { crossOrigin: "anonymous" }
                    );
                  }}
                >
                  <img alt={nftWithImage.name} src={imageUrl} width="100%" />
                </div>
              );
            })}
      </div>
    </>
  );
};

const isWizards = (address: string) =>
  address === "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42";

const removeWizardsBackground = (img: fabric.Object) => {
  var filterRed = getColorFilter("#1E0201");
  var filterGreen = getColorFilter("#1E0201");
  var filterBlue = getColorFilter("#1E0201");
  var filterBlack = getColorFilter("#1E0201");

  // @ts-ignore
  img.filters.push(filterRed);
  // @ts-ignore
  img.filters.push(filterGreen);
  // @ts-ignore
  img.filters.push(filterBlue);
  // @ts-ignore
  img.filters.push(filterBlack);
  // @ts-ignore
  img.applyFilters();
};

export default Editor;
