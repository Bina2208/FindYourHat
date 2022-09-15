const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const LEFT = 'l';
const RIGHT = 'r';
const UP = 'u';
const DOWN = 'd';

class Field {
    #field;
    #direction;
    #currentPosX = 0;
    #currentPosY = 0;

    constructor(arrPos2D) {
        this.#field = arrPos2D;
        if(arrPos2D.startX !== undefined)
            this.#currentPosX = arrPos2D.startX;
        if(arrPos2D.startY !== undefined)
            this.#currentPosY = arrPos2D.startY;
        this.print();
    }

    print() {
        for (const i of this.#field) {
            console.log(`${i.join()}`);
            
        }
        console.log(`Your Coordinats x:${this.#currentPosX} y:${this.#currentPosY}`);
        this.#direction = prompt('Which way? ');
        this.move(this.#direction);
    }

    checkInput(input) {
        const strInput = input.toString().toLowerCase();
        if (strInput === RIGHT || strInput === LEFT || strInput === UP || strInput === DOWN) {
            return true;
        } else {
            return false;
        }
    }

    checkNewPos() {
        if (this.#currentPosY < this.#field.length && this.#currentPosY >= 0) {
            if (this.#currentPosX < this.#field[this.#currentPosY].length && this.#currentPosX >= 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    doMove(direction) {
        switch (direction) {
            case RIGHT:
                this.#currentPosX++;
                break;
            case LEFT:
                this.#currentPosX--;
                break;
            case UP:
                this.#currentPosY--;
                break;
            case DOWN:
                this.#currentPosY++;
                break;
            default:
                console.error('Update doMove-Function!');
                break;
        }
    }

    updateCurrentPos() {
        this.#field[this.#currentPosY][this.#currentPosX] = pathCharacter;
    }

    inspectResultOfTheMove() {
        if (this.checkNewPos()) {
            const currentElement = this.#field[this.#currentPosY][this.#currentPosX];
            switch (currentElement) {
                case hole:
                    console.log('GAME OVER: You falled in a hole.');
                    break;
                case fieldCharacter:
                    this.updateCurrentPos();
                    this.print();
                    break;
                case pathCharacter:
                    this.print();
                    break;
                case hat:
                    console.log('WIN: Great! You found your hat. :).');
                    break;
                default:
                    console.error(`Your input field contains a unknown sign: ${currentElement}`);
                    break;
            }
        } else {
            console.log('GAME OVER: You reached the border and fell of the edge.');
        }
    }

    move(direction) {
        if (this.checkInput(direction)) {
            this.doMove(direction);
            this.inspectResultOfTheMove();
        } else {
            console.log(`Wrong input: ${direction}. Use "r" for right, "l" for left, "u" for up and "d" for down`);
            this.print();
        }
    }

    static generateField(width, height, percentage) {
        const myField = [];
        const fieldSize = width * height;
        // percentage of holes
        const holeCount = Math.round(fieldSize * (percentage / 100));
        // array for random hole selection
        let arrRandomPos = [];

        // ----------------------------------------
        // HELPER FUNCTION: get random ArrayPos
        const randomArrPos = (arrLength) => {
            return Math.floor(Math.random() * arrLength);
        }
        // HELPER FUNCTION: extract random Pos from an position Array
        const editFieldAndPosArray = (myField, sign, arrRandomPos, posIndex) => {
            // set sign on random position
            myField[arrRandomPos[posIndex].y][arrRandomPos[posIndex].x] = sign;
            // remove position from possible selections
            arrRandomPos.splice(posIndex, 1);
        }
        //----------------------------------------

        // Init arrays
        for (let i = 0; i < height; i++) {
            myField[i] = new Array(width);
            arrRandomPos[i] = new Array(width);
            for (let j = 0; j < width; j++) {
                arrRandomPos[i][j] = {
                    x: j,
                    y: i
                };
                myField[i][j] = fieldCharacter;
            }
        }
        // build a flat array with objecst of possible positions for holes
        arrRandomPos = arrRandomPos.flat();

        //------------------- Start Position --------------
        // set a random start position
        let startPosIndex = randomArrPos(arrRandomPos.length);
        // add startPosition to field
        myField.startX = arrRandomPos[startPosIndex].x;
        myField.startY = arrRandomPos[startPosIndex].y;
        editFieldAndPosArray(myField, pathCharacter, arrRandomPos, startPosIndex);
        
        // ------------------ Holes ------------------------
        // set random holes
        let hCnt = 0;
        while(hCnt < holeCount) {
            // random selection of the possible positions for the holes
            let posIndex = randomArrPos(arrRandomPos.length);
            // set random holes and remove position from arrRandomPos
            editFieldAndPosArray(myField, hole, arrRandomPos, posIndex);
            hCnt++;
        }
        
        // ------------------- Hat -------------------------
        //set hat
        let hatPosIndex = randomArrPos(arrRandomPos.length);
        editFieldAndPosArray(myField, hat, arrRandomPos, hatPosIndex);

        return myField;     
    }
}

const test = Field.generateField(4, 5, 50);
const myField = new Field(test);
