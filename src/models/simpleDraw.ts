interface IPosition {
  x: number | null;
  y: number | null;
}

interface IConfig {
  strokeStyle: string;
  lineWidth: number;
  drawType: string;
}

interface DrawInfo {
  beginX: number | null;
  beginY: number | null;
  lastX: number;
  lastY: number;
  strokeStyle: string;
  lineWidth: number;
  drawType: string;
}

interface EraserConfig {
  transparency: number;
  size: number;
}

export class SimpleDraw {
  drawing: boolean = false;

  ctx: CanvasRenderingContext2D;

  private lastPosition: IPosition = {
    x: null,
    y: null,
  };

  private eraserConfig: EraserConfig = {
    transparency: 0.1,
    size: 10,
  };

  private dpr = window.devicePixelRatio || 1;

  private singlePathData: DrawInfo[] = [];

  private pathData: DrawInfo[][] = [];

  private config: IConfig

  constructor(private canvasEle: HTMLCanvasElement, config: IConfig) {
    this.ctx = this.canvasEle.getContext("2d")!;
    this.config = config
    this.init();
  }

  private init() {
    this.registerEvent();
    this.initCanvasSize();
  }

  private initCanvasSize() {
    this.canvasEle.width = (document.body.clientWidth - 20) * this.dpr;
    this.canvasEle.height = (document.body.clientHeight - 20) * this.dpr;
    this.canvasEle.style.width = document.body.clientWidth - 20 + "px";
    this.canvasEle.style.height = document.body.clientHeight - 20 + "px";
    this.ctx.scale(this.dpr, this.dpr);
  }

  private registerEvent() {
    if (window.PointerEvent) {
      this.canvasEle.addEventListener(
        "pointerdown",
        this.drawStart.bind(this),
        false
      );
      this.canvasEle.addEventListener(
        "pointermove",
        this.setPosition.bind(this),
        false
      );
      this.canvasEle.addEventListener(
        "pointerup",
        this.drawEnd.bind(this),
        false
      );
    } else {
      this.canvasEle.addEventListener("mousedown", this.drawStart, false);
      this.canvasEle.addEventListener("mousemove", this.setPosition, false);
      this.canvasEle.addEventListener("mouseup", this.drawEnd, false);
    }
  }

  private base64ToBlob(dataURI: string) {
    const [typeString, byte] = dataURI.split(",");
    const mimeString = typeString.split(":")[1].split(";")[0]; // mime??????
    const byteString = atob(byte); // base64 ??????
    const arrayBuffer = new ArrayBuffer(byteString.length); // ??????????????????
    const intArray = new Uint8Array(arrayBuffer); // ????????????

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([intArray], { type: mimeString });
  }

  async save() {
    const canvasUrl = this.canvasEle.toDataURL("image/png");
    const fileHandle = await (window as any).showSaveFilePicker({
      suggestedName: "test.png",
      types: [
        {
          description: "PNG file",
          accept: {
            "image/png": [".png"],
          },
        },
      ],
    });

    const writable = await fileHandle.createWritable();
    const blob = this.base64ToBlob(canvasUrl);
    await writable.write(blob);
    await writable.close();

    return fileHandle;
  }

  clear() {
    const rect = this.canvasEle.getBoundingClientRect();
    this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
  }

  useEraser() {
    this.setFillColor(`rgba(36, 36, 36, 0.9`);
    this.setLineWidth(this.eraserConfig.size);
  }

  setFillColor(strokeStyle = "green") {
    this.config = {
      ...this.config,
      strokeStyle,
    };
  }

  setLineWidth(lineWidth = 3) {
    this.config = {
      ...this.config,
      lineWidth,
    };
  }

  revoke() {
    if (!this.pathData.pop()) return;
    this.clear();
    this.pathData.forEach((item) => item.forEach((info) => this.draw(info)));
  }

  drawStart() {
    this.drawing = true;
  }

  drawEnd() {
    this.drawing = false;
    this.lastPosition = { x: null, y: null };
    this.pathData.push(this.singlePathData);
    this.singlePathData = [];
  }

  draw(pathInfo: DrawInfo) {
    if (pathInfo.beginX !== null && pathInfo.beginY !== null) {
      const { lastX, lastY, beginX, beginY, strokeStyle, lineWidth } = pathInfo;
      this.ctx.beginPath(); // ????????????
      this.ctx.lineCap = "round"; // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      this.ctx.moveTo(beginX, beginY); // ??????????????????beginX, beginY
      this.ctx.lineTo(lastX, lastY); // ??????lastX, lastY?????????(lineTo??????????????????)
      this.ctx.strokeStyle = strokeStyle; // ??????????????????
      this.ctx.lineWidth = lineWidth; // ??????????????????
      this.ctx.stroke(); // ????????????
      this.ctx.closePath(); // ???????????????????????????????????????????????????????????????????????????????????????
    }
  }

  setPosition(event: PointerEvent | MouseEvent) {
    if (this.drawing) {
      const singleData: DrawInfo = {
        beginX: this.lastPosition.x,
        beginY: this.lastPosition.y,
        lastX: event.pageX,
        lastY: event.pageY,
        strokeStyle: this.config.strokeStyle,
        lineWidth: this.config.lineWidth,
        drawType: this.config.drawType,
      };

      this.lastPosition = {
        x: event.pageX,
        y: event.pageY,
      };
      this.singlePathData.push(singleData);

      this.draw(singleData);
    }
  }
}
