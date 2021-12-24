import { FC, useCallback, useEffect } from "react";
import { fabric } from "fabric";
import { useMoralis, useNFTBalances } from "react-moralis";
import { Button, Container, TextInput } from "nes-react";
import {
  FabricJSCanvas,
  FabricJSEditor,
  useFabricJSEditor,
} from "fabricjs-react";
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
            color: "#0F2027",
            offset: 0,
          },
          {
            color: "#203A43",
            offset: 0.5,
          },
          {
            color: "#2C5364",
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
    const deleteListener = (e: KeyboardEvent) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        editor?.canvas.remove(editor?.canvas.getActiveObject());
      }
    };
    document.addEventListener("keydown", deleteListener);
    return () => {
      document.removeEventListener("keydown", deleteListener);
    };
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
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Container
          title="Select castle"
          // @ts-ignore
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              X
              <TextInput
                style={{ width: 100 }}
                value={x as string}
                onChange={handleXChange as () => void}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Y
              <TextInput
                style={{ width: 100 }}
                value={y as string}
                onChange={handleYChange as () => void}
              />
            </div>
          </div>
        </Container>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Button
            // @ts-ignore
            onClick={() => {
              addTextLabel(editor);
            }}
          >
            Add Text
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
        </div>
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
                <div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <button
                      style={{ fontFamily: "monospace", margin: 5 }}
                      onClick={() => {
                        addImage(editor, imageUrl, false);
                      }}
                    >
                      Insert
                    </button>
                    <button
                      style={{ fontFamily: "monospace", margin: 5 }}
                      onClick={() => {
                        addImage(editor, imageUrl, true);
                      }}
                    >
                      without Background
                    </button>
                  </div>
                  <div style={{ width: 100, padding: 10 }}>
                    <img alt={nftWithImage.name} src={imageUrl} width="100%" />
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
};

const addImage = (
  editor: FabricJSEditor | undefined,
  imageUrl: string,
  removeBackground: boolean
) => {
  fabric.Image.fromURL(
    imageUrl,
    (oImg) => {
      const scale = 200 / (oImg.width ?? 100);

      var img1 = oImg.set({
        scaleX: scale,
        scaleY: scale,
      });

      if (removeBackground) {
        const backgroundColor = getBackgroundColor(oImg).toHex();
        console.log("@@@", backgroundColor);
        // @ts-ignore
        img1.filters.push(getColorFilter(`#${backgroundColor}`));
        // @ts-ignore
        img1.applyFilters();
      }

      editor?.canvas.add(img1);

      editor?.canvas.centerObject(img1);
    },
    { crossOrigin: "anonymous" }
  );
};
const addTextLabel = (editor: FabricJSEditor | undefined) => {
  if (editor?.canvas != null) {
    const label = new fabric.IText("Click to edit", {
      fontFamily: "Press Start 2P",
      fontSize: 28,
      top: 20,
    });
    editor?.canvas.add(label);
    editor?.canvas.centerObject(label);
  }
};

const getBackgroundColor = (img: fabric.Image) => {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  const imgElement = img.getElement();
  context?.drawImage(imgElement, 0, 0);
  const rgba = context?.getImageData(1, 1, 1, 1).data ?? [];
  console.log("@@@", rgba);
  canvas.remove();
  return fabric.Color.fromRgba(
    `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`
  );
};

export default Editor;
