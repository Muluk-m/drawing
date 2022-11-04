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

export class SimpleDraw {
  drawing: boolean = false;

  lastPosition: IPosition = {
    x: null,
    y: null,
  };

  ctx: CanvasRenderingContext2D;

  dpr = window.devicePixelRatio || 1;

  singlePathData: any[] = [];

  constructor(private canvasEle: HTMLCanvasElement, private config: IConfig) {
    this.ctx = this.canvasEle.getContext("2d")!;
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

  clear() {
    const rect = this.canvasEle.getBoundingClientRect();
    this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
  }

  setFillColor(strokeStyle = "green") {
    this.ctx.strokeStyle = strokeStyle;
  }

  setLineWidth(lineWidth = 3) {
    this.ctx.lineWidth = lineWidth;
  }

  drawStart() {
    this.drawing = true;
  }

  drawEnd() {
    this.drawing = false;
    this.lastPosition = { x: null, y: null };
  }

  draw(pathInfo: DrawInfo) {
    if (pathInfo.beginX !== null && pathInfo.beginY !== null) {
      const { lastX, lastY, beginX, beginY, strokeStyle, lineWidth } = pathInfo;
      this.ctx.beginPath(); // 开始绘图
      this.ctx.lineCap = "round"; // 绘制线的两头是圆形，其他形状也可以，不加的话，在线条宽度很大的情况下，画出来的线条横向一条一条的
      this.ctx.moveTo(beginX, beginY); // 将鼠标移动到beginX, beginY
      this.ctx.lineTo(lastX, lastY); // 指定lastX, lastY为终点(lineTo不会绘制路径)
      this.ctx.strokeStyle = strokeStyle || "green"; // 设置线的颜色
      this.ctx.lineWidth = lineWidth || 3; // 设置线的宽度
      this.ctx.stroke(); // 绘制路径
      this.ctx.closePath(); // 结束绘制，不结束的话，无法改变后面新增路径的颜色大小等数据
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

      this.draw(singleData);
    }
  }
}
