const PriorityQueue = require("./priorityQueue");

class Node {
  constructor(num, ch = "#") {
    this.num = num;
    this.ch = ch;
    this.left = null;
    this.right = null;
  }
}

class Huffman {
  encode(words) {
    const pq = new PriorityQueue();

    let freq = Array(26).fill(0);
    for (let i = 0; i < words.length; i++) {
      if (words.charAt(i) !== " ") {
        freq[words.charAt(i).charCodeAt(0) - "a".charCodeAt(0)] += 1;
      }
    }

    for (let i = 0; i < 26; i++) {
      if (freq[i] !== 0) {
        pq.enqueue(
          new Node(freq[i], String.fromCharCode(i + "a".charCodeAt(0)))
        );
      }
    }

    while (pq.size() > 1) {
      let left = pq.dequeue();
      let right = pq.dequeue();
      let newNode = new Node(left.num + right.num);
      newNode.left = left;
      newNode.right = right;
      pq.enqueue(newNode);
    }

    const root = pq.dequeue();
    const huffmanCodes = {};

    function generateCodes(node, code) {
      if (!node) return;
      if (node.ch !== "#") {
        huffmanCodes[node.ch] = code;
      }
      generateCodes(node.left, code + "0");
      generateCodes(node.right, code + "1");
    }

    generateCodes(root, "");

    let encodedStr = "";
    for (let i = 0; i < words.length; i++) {
      if (words.charAt(i) !== " ") {
        encodedStr += huffmanCodes[words.charAt(i)];
      }
    }

    return encodedStr;
  }

  toBinary(encodedStr) {
    const buffer = Buffer.alloc(Math.ceil(encodedStr.length / 8));
    for (let i = 0; i < encodedStr.length; i += 8) {
      const byte = encodedStr.substring(i, i + 8);
      buffer[i / 8] = parseInt(byte, 2);
    }
    return buffer;
  }
}

module.exports = Huffman;
