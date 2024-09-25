import React from 'react';



interface d2 {
  x: number,
  y: number,
}



function sfc32(a: number, b: number, c: number, d: number) {
  return function () {
    a |= 0; b |= 0; c |= 0; d |= 0;
    const t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  };
}


export default function Place() {

  // const seed = cyrb128('apples');
  // var rand = splitmix32(seed[0]);

  const seed = 1337 ^ 0xDEADBEEF;
  const rand = sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rect = canvasRef.current?.getBoundingClientRect();


  const sizeX = 500;
  const sizeY = 500;
  const [selectedPixel, setSelectedPixel] = React.useState<d2>({ x: -1, y: -1 });
  const [translate, setTranslate] = React.useState<d2>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);

  const [selectedColor, setSelectedColor] = React.useState<number>(-1);
  const [activePixel, setActivePixel] = React.useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const colorOptions = [
    '231, 76, 60',    // red
    '230, 126, 34',   // orange
    '241, 196, 15',   // yellow
    '46, 204, 113',   // green
    '52, 152, 219',   // blue
    '155, 89, 182',   // purple
    '236, 240, 241',  // white
    '44, 62, 80',     // black
  ];


  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');

    // const colorOptions = {
    //   'red': '231, 76, 60',
    //   'orange': '230, 126, 34',
    //   'yellow': '241, 196, 15',
    //   'green': '46, 204, 113',
    //   'blue': '52, 152, 219',
    //   'purple': '155, 89, 182',
    //   'white': '236, 240, 241',
    //   'black': '44, 62, 80',
    // }

    const fakeData = [
      [0, 7, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [7, 0, 7, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 7, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [7, 0, 7, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 7, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

      [0, 0, 0, 1, 1, 1, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 2, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    ];

    // fakeData.forEach((line, y) => {
    //   line.forEach((pixel: any, x) => {
    //     // const [colorIndex, email] = pixel.split(':');
    //     const colorIndex = pixel;

    //     ctx!.fillStyle = 'rgb(' + colorOptions[colorIndex] + ')';
    //     ctx?.fillRect(x, y, 1, 1);
    //   });
    // });


    for (let i = 0; i < canvasRef.current!.width; i++) {
      for (let j = 0; j < canvasRef.current!.height; j++) {
        ctx!.fillStyle = `rgb(${rand() * 255}, ${rand() * 255}, ${rand() * 255})`;
        // ctx!.fillStyle = `rgb(${Math.floor(255 - 0.5 * i)}, ${Math.floor(255 - 0.5 * j)}, 0)`;
        ctx!.fillRect(j, i, 1, 1);
      }
    }

  }, [colorOptions, rand]);



  // React.useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     const ctx = canvas.getContext('2d');
  //     if (ctx) {
  //       // Clear the canvas
  //       ctx.clearRect(0, 0, canvas.width, canvas.height);

  //       // Draw zoomed area
  //       const sx = selectedPixel.x - sizeX / zoom / 2;
  //       const sy = selectedPixel.y - sizeY / zoom / 2;
  //       const sWidth = sizeX / zoom;
  //       const sHeight = sizeY / zoom;

  //       ctx.imageSmoothingEnabled = false; // Disable smoothing for pixelated effect

  //       ctx.drawImage(
  //         canvas,     // Source canvas
  //         sx, sy,     // Source x, y
  //         sWidth, sHeight, // Source width, height
  //         0, 0,       // Destination x, y
  //         canvas.width, canvas.height // Destination width, height
  //       );

  //       // Draw the initial image again for reference
  //       for (let i = 0; i < sizeX; i++) {
  //         for (let j = 0; j < sizeY; j++) {
  //           ctx.fillStyle = `rgb(${Math.floor(255 - 10 * i)}, ${Math.floor(255 - 10 * j)}, 0)`;
  //           ctx.fillRect(i, j, 1, 1);
  //         }
  //       }
  //     }
  //   }
  // }, [zoom, selectedPixel]);


  //   const rect = canvas.getBoundingClientRect();

  //   // Calculate the click position relative to the canvas
  //   const x = Math.floor((event.clientX - rect.left) * canvas.width / rect.width);
  //   const y = Math.floor((event.clientY - rect.top) * canvas.height / rect.height);

  //   console.log(`Clicked pixel: (${x}, ${y})`);

  //   // Highlight the clicked pixel
  //   ctx.strokeStyle = 'white';
  //   ctx.lineWidth = 1 / scaleFactor; // Adjust line width for scaled canvas
  //   ctx.strokeRect(x, y, 1, 1);
  // });


  const canvasClicked = (e: any) => {
    // const clickedX = Math.floor((e.pageX) / zoom) ;
    // const clickedY = Math.floor((e.pageY) / zoom);


    if (rect && canvasRef.current) {

      const clickX = (e.clientX - rect.left);
      const clickY = (e.clientY - rect.top);

      const x = Math.floor((e?.clientX - rect.left) * canvasRef.current.width / rect?.width);
      const y = Math.floor((e?.clientY - rect.top) * canvasRef.current.height / rect?.height);


      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;

      const translateX = centerX - x;
      const translateY = centerY - y;

      const objZoom = 16;

      setSelectedPixel({ x: x, y: y });
      setZoom(objZoom);
      setTranslate({ x: translateX * objZoom, y: translateY * objZoom });

      console.log(x, y, centerX, centerY, translateX, translateY);
      // setOverlayStyle({ ...overlayStyle, top: `${(y * zoom) + rect.top}px`, left: `${(x * zoom) + rect.left}px`, display: 'block' });
      // setOverlayStyle({ ...overlayStyle, top: `${(y * zoom) + rect.top}px`, left: `${(x * zoom) + rect.left}px`, display: 'block' });
    }

    // console.log(e);
    // console.log(clickedX, clickedY );


    // setActivePixel(`${clickedY}:${clickedX}`);
  };

  // const [overlayStyle, setOverlayStyle] = React.useState<React.CSSProperties | undefined>({ top: '0px', left: '0px', display: 'hidden' });


  return (
    <>
      <div style={{ marginLeft: '20px', marginTop: '10px' }}>

        <div style={{ width: '500px', height: '500px', backgroundColor: 'pink', overflow: 'hidden' }}>

          <canvas style={{
            imageRendering:  'pixelated',
            // transformOrigin: 'top left',
            transformOrigin: 'center center',
            // transform:      `scale(${zoom})`,
            transform:       `scale(${zoom}) translate(${translate.x / zoom}px, ${translate.y / zoom}px)`,
            transition:      'transform 3s linear',
          }}
          ref={canvasRef}
          onClick={canvasClicked}
          width='500px'
          height='500px'
          // width={sizeX} height={sizeY}
          >
          </canvas>

          {rect && <div id="overlay"
            style={{ position:  'absolute',
              zIndex:    99,
              width:     `${zoom - 2}px`,
              height:    `${zoom - 2}px`,
              border:    '1px solid black',
              boxShadow: `0 0 ${zoom / 2}px ${zoom / 4}px white`,

              top:        `${(selectedPixel.y * zoom) + rect?.top}px`,
              left:       `${(selectedPixel.x * zoom) + rect.left}px`,
              visibility: selectedPixel.x > -1 ? 'visible' : 'hidden',
              display:    selectedPixel.x > -1 ? 'block' : 'hidden' }
            }></div>
          }

        </div>

        <div>
          <p>Last changed by tttt</p>
          <div className="nav">
            {colorOptions.map((color, index) => (
              <button
                key={index}
                style={{
                  backgroundColor: `rgb(${color})`,
                  width:           '4rem',
                  height:          '2rem',
                  margin:          '0 0.25rem',
                  borderRadius:    '0.5rem',
                  border:          `2px solid ${selectedColor === index ? 'white' : 'black'}`,
                }}

                onClick={() => setSelectedColor(index)}
              >
              </button>
            ))}
          </div>
        </div>

      </div>


    </>
  );
}
