// priorityQueue.js
class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  heapifyUp(index) {
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].num > this.heap[index].num) {
        this.swap(index, parentIndex);
      }
      index = parentIndex;
    }
  }

  heapifyDown(i) {
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    let small = i;

    if (l < this.heap.length && this.heap[l].num < this.heap[small].num) {
      small = l;
    }
    if (r < this.heap.length && this.heap[r].num < this.heap[small].num) {
      small = r;
    }
    if (small !== i) {
      this.swap(i, small);
      this.heapifyDown(small);
    }
  }

  enqueue(element) {
    this.heap.push(element);
    this.heapifyUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.empty()) {
      return null;
    }
    if (this.heap.length === 1) return this.heap.pop();
    const elt = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return elt;
  }

  empty() {
    return this.heap.length === 0;
  }

  size() {
    return this.heap.length;
  }
}

module.exports=PriorityQueue;
