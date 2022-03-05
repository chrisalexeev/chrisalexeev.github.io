import * as fs from 'fs';

class Node {
    constructor(col,row) {
        this.col = col;
        this.row = row;

        this.left = this;
        this.right = this;
        this.up = this;
        this.down = this;
    }
}

class ColumnHeader extends Node {
    constructor(index) {
        super(this,index)
        this.length = 0;
    }
}

class Board {
    constructor(board) {
        this.root = new ColumnHeader(0);
        this.n2 = 0;
        this.n = 0;
        this.size = null;

        this.board = {}
        this.boardList = []
        this.nodeList = []
        this.colHeaders = []

        this.loadSudoku(board)
    }

    loadSudoku(board) {
        let rowCount = 0;
        board.forEach(row => {
            let colCount = 0;
            row.forEach(item => {
                this.boardList.push(item ? item : -1);
                this.board[`${rowCount} ${colCount++}`] = item ? item : -1;
            })
            rowCount++;
        })

        this.n2 = rowCount;
        this.n = Math.floor(Math.sqrt(this.n2))
        this.size = Math.pow(this.n2,2)
        this.createMatrix(this.board)
    }

    createMatrix(boardList) {

        letroot = this.root
        this.colHeaders = [root]

        for (let i = 0; i < this.size * 4; i++) {
            let col = ColumnHeader(i + 1)
            col.right = root
            col.left = root.left
            root.left.right = col
            root.left = col
            self.colHeaders.append(col)
        }

        let idx = 0
        boardList.forEach(item => {
            if (item !== -1) {
                // if cell is not empty, create only one set of nodes
                this._createNodes(index,item)
            } else {
                // if cell is not empty, create node sets for each possible value for each cell
                for (let k = 0; k < this.n2; k++)
                    _createNodes(index,k + 1)
            }
        })
            
    }
        // defines constraints
    rowIndex        = (i,j) => this.n2 * i + j
    rowConstraint   = (i,y) => this.size + Math.floor(i / this.n2) * this.n2 + y
    colConstraint   = (j,y) => this.size*2 + (j % this.n2) * this.n2 + y
    boxConstriant   = (x,y) => this.size*3 + Math.floor(x / (this.n2*this.n)) * (this.n2*this.n) + (x % this.n2) // self.n*self.n2 + y
    
    _createNodes(x,y) {
        // create nodes for cell and 
        cell    = Node(this.colHeaders[x + 1], this.rowIndex(x,y))
        row     = Node(this.colHeaders[this.rowConstraint(x,y)],this.rowIndex(x,y))
        col     = Node(this.colHeaders[this.colConstraint(x,y)],this.rowIndex(x,y))
        box     = Node(this.colHeaders[this.boxConstriant(x,y)],this.rowIndex(x,y))

        // links cell to row, column, and box (define restrictions)
        cell.left   = box
        cell.right  = row

        row.left    = cell
        row.right   = col
        
        col.left    = row
        col.right   = box

        box.left    = col
        box.right   = cell

        // link nodes to corresponding column headers
        this._linkNodes(cell)
        this._linkNodes(row)
        this._linkNodes(col)
        this._linkNodes(box)
    }

    _linkNodes(node) {
        col = node.col
        node.down = col
        node.up = col.up
        col.up.down = node
        col.up = node
        col.length += 1
    }
}