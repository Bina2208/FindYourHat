const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    #field;
    #direction;
    #currentPosX = 0;
    #currentPosY = 0;

    constructor(arr2D) {
        this.#field = arr2D;
        this.print();
    }

    print() {
        for (const i of this.#field) {
            console.log(`${i.join()}`);
        }
        this.#direction = prompt('Which way? ');
        this.move(this.#direction);
    }

    checkInput(input) {
        const strInput = input.toString().toLowerCase();
        if (strInput === 'r' || strInput === 'l' || strInput === 'u' || strInput === 'd') {
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
            case 'r':
                this.#currentPosX++;
                break;
            case 'l':
                this.#currentPosX--;
                break;
            case 'u':
                this.#currentPosY--;
                break;
            case 'd':
                this.#currentPosY++;
                break;
            default:
                console.error('Update doMove-Function!');
                break;
        }
    }

    updateCurrentPos() {
        this.#field[this.#currentPosY][this.#currentPosX] = '*';
    }

    inspectResultOfTheMove() {
        if (this.checkNewPos()) {
            const currentElement = this.#field[this.#currentPosY][this.#currentPosX];
            switch (currentElement) {
                case 'O':
                    console.log('GAME OVER: You falled in a hole.');
                    break;
                case '░':
                    this.updateCurrentPos();
                    this.print();
                    break;
                case '*':
                    this.print();
                    break;
                case '^':
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
            console.log(`Wrong input: ${input}. Use "r" for right, "l" for left, "u" for up and "d" for down`);
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


        for (let i = 0; i < height; i++) {
            myField[i] = new Array(width);
            arrRandomPos[i] = new Array(width);
            for (let j = 0; j < width; j++) {
                arrRandomPos[i][j] = {
                    x: i,
                    y: j
                };
                myField[i][j] = '░';
            }
        }

        // build a flat array with objecst of possible positions for holes
        arrRandomPos = arrRandomPos.flat();

        myField[0][0] = '*';
        // Remove start position of '*' for possible holes
        arrRandomPos.splice(0,1);

        
        let hCnt = 0;
        while(hCnt < holeCount) {
            // random selection of the possible positions for the holes
            let pos = Math.floor(Math.random() * arrRandomPos.length);
            // set random holes 
            myField[arrRandomPos[pos].x][arrRandomPos[pos].y] = 'O';
            // remove hole position from next random selection
            arrRandomPos.splice(pos, 1);
            hCnt++;
        }
        
        //set hat
        let hatPos = Math.floor(Math.random() * arrRandomPos.length);
        myField[arrRandomPos[hatPos].x][arrRandomPos[hatPos].y] = '^';

        return myField; 

        // test output
        /* console.log(holeCount);
        for (const i of myField) {
        
            console.log(`${i.join()}`);
        } */
    
    }
}

const test = Field.generateField(4, 5, 50);
const myField = new Field(test);
