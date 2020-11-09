        //   circle = `
        //   <circle
        //   cx="${Math.random() * (data.f[i] - i)}"
        //   cy="${Math.random() * (data.f[i] - i)}"
        //   r="${Math.random() * data.f[i]}"
        //   opacity={opacity}
        //   fill="${color2}"
        // />`;


        // Generate lines
        function generateDrums(f, canva) {
            let line;
        
            ////////
            const color = getColor(convert(f));
            const fnum = f.reduce((a, b) => a + b);
            const opacity = Math.random();
        
            if (fnum > 1000) {
              line = document.createElementNS("http://www.w3.org/2000/svg", "line");
              line.setAttribute("id", "drum-element");
              line.setAttribute("stroke", color);
              line.setAttribute("opacity", opacity);
              line.setAttribute("x1", Math.random() * fnum);
              line.setAttribute("x2", Math.random() * fnum);
              line.setAttribute("y1", Math.random() * fnum);
              line.setAttribute("y2", Math.random() * fnum);
              canva.appendChild(line);
              if (canva.hasChildNodes()) {
                setTimeout(() => {
                  canva.removeChild(line);
                }, 300);
              }
            }
            ///////
          }


          <polygon
          key={i}
          fill={"#" + color}
          points={`${p1},${p2} ${p21},${p3},${p4}${p41},${p5}`}
          opacity={opacity}
        />

        // POLYGON

        let line;

        ////////
        const color = getColor(convert(f));
        const fnum = f.reduce((a, b) => a + b);
        const opacity = Math.random();
        const p1 = Math.floor(Math.random() * fnum);
        const p2 = Math.floor(Math.random() * fnum);
        const p21 = Math.floor(Math.random() * fnum);
        const p3 = Math.floor(Math.random() * fnum);
        const p4 = Math.floor(Math.random() * fnum);
        const p41 = Math.floor(Math.random() * fnum);
        const p5 = Math.floor(Math.random() * fnum);
    
        if (fnum > 1000) {
          line = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
          line.setAttribute("id", "drum-element");
          line.setAttribute("fill", color);
          line.setAttribute("opacity", opacity);
          line.setAttribute("style", "z-index:2;");
          line.setAttribute("points", `${p1},${p2} ${p21},${p3},${p4}${p41},${p5}`);
          canva.appendChild(line);
          if (canva.hasChildNodes()) {
            setTimeout(() => {
              canva.removeChild(line);
            }, 300);
          }
        }