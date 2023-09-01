import styled from 'styled-components';

const PlaceStyled = styled.section`

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  font-family: "Lato", "Lucida Grande", "Lucida Sans Unicode", Tahoma, Sans-Serif;
  user-select: none;
}

body {
  background-color: lightgray;
}

#canvas {
  position: absolute;
  top: 0;
  bottom: 60px;
  left: 0;
  right: 0;
  //pointer-events: none;
}

.controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  //height: 40px;
  background-color: #343436;
  padding: 0;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  overflow: hidden;

  .face-space {
    width: 60px;
  }


}

#auth {
  cursor: pointer;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 0 20px;
  height: 100%;
  min-height: 60px;

  background-color: #66666E;



  &:hover {
    background-color: #000;
  }

  svg {
    height: 100%;
  }

  span {
    margin-left: 10px;
  }
}

#colors {
  margin: 0;
  padding: 10px;
  flex: 1;
  text-align: center;
  transition: transform 0.5s ease-in-out;
  position: relative;

  &:before {
    color: white;
    display: block;
    position: absolute;
    bottom: 100%;
    width: 100%;
    padding: 10px;
    //margin-bottom: 10px;
    text-align: center;
    content: "You're free to look around, but to help prevent spam you need to login before you can draw, sorry about that."
  }

  li {
    width: 25px;
    height: 25px;
    display: inline-block;
    list-style: none;
    margin: 0;

    &.active {
      outline: 3px solid white;
    }

    &:not(:last-child) {
      margin-right: 5px;
    }

    &#c-ffffff {
      background-color: #ffffff;
      outline-color: #bbb;
    }

    &#c-e4e4e4 {
      background-color: #e4e4e4;
    }

    &#c-888888 {
      background-color: #888888;
    }

    &#c-222222 {
      background-color: #222222;
    }

    &#c-ffa7d1 {
      background-color: #ffa7d1;
    }

    &#c-e50000 {
      background-color: #e50000;
    }

    &#c-e59500 {
      background-color: #e59500;
    }

    &#c-a06a42 {
      background-color: #a06a42;
    }

    &#c-e5d900 {
      background-color: #e5d900;
    }

    &#c-94e044 {
      background-color: #94e044;
    }

    &#c-02be01 {
      background-color: #02be01;
    }

    &#c-00d3dd {
      background-color: #00d3dd;
    }

    &#c-0083c7 {
      background-color: #0083c7;
    }

    &#c-0000ea {
      background-color: #0000ea;
    }

    &#c-cf6ee4 {
      background-color: #cf6ee4;
    }

    &#c-820080 {
      background-color: #820080;
    }
  }


}

.cooldown {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #343436;

  flex-direction: row;
  justify-content: center;
  align-items: center;

  color: white;
  text-align: center;

  display: none;
}

.info {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  color: white;
  font-size: 12px;

  span {
    color: #ff5555;
  }

  &.drawing {
    display: none;
  }

  &.loading {
    display: none;
  }

  &.general {
    display: block;
  }
}

.loading {
  .info {
    &.drawing {
      display: none !important;
    }

    &.loading {
      display: block !important;
    }

    &.general {
      display: none !important;
    }
  }
}

.zoom-controls {
  position: absolute;
  top: 10px;
  right: 10px;

  >div {
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 5px;
    color: white;
    font-size: 12px;

    &:hover {
      cursor: pointer;
      background-color: black;
    }

    &:not(:first-child) {
      margin-top: 5px;
    }
  }
}

.selectedColor {
  &.zoomed {
    .info {
      &.drawing {
        display: block;
      }

      &.general {
        display: none;
      }
    }
  }
}

.dragging {
  #canvas {
    cursor: move;
  }
}

.logged-out {
  #auth {
    animation: 1s linear pulse infinite;
  }

  #colors {
    transform: translateY(100%);
  }
}

.cooling {
  .cooldown {
    display: flex;
  }
}

@keyframes pulse {
  0% {
    background: #66666E;
  }

  50% {
    background: #DB5461;
  }

  100% {
    background: #66666E;
  }
}

`;

export default PlaceStyled;
