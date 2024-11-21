from collections import defaultdict
import heapq
import os
import pickle

class Node:
    def __init__(self, data="$#",count=0):
        self.data = data
        self.count=count
        self.left = None
        self.right = None

    def __lt__(self,other):
        self.count<other.count

class HuffmanCoding:
    def __init__(self, file_path):
        self.file_path = file_path
        self.character_count = defaultdict(int)
        self.char_binary = defaultdict()
        self.heap = []
        self.root = None

    def build_frequency_table(self):
        with open(self.file_path, 'r') as file:
            for char in file.read():
                self.character_count[char] += 1

    def build_heap(self):
        for char, count in self.character_count.items():
            heapq.heappush(self.heap, (count, Node(char,count)))

    def build_huffman_tree(self):
        while len(self.heap) > 1:
            count1, node1 = heapq.heappop(self.heap)
            count2, node2 = heapq.heappop(self.heap)
            merged = Node()
            merged.left = node1
            merged.right = node2
            heapq.heappush(self.heap, (count1 + count2, merged))
        self.root = heapq.heappop(self.heap)[1]

    def build_codes(self, node, binary_str=""):
        if not node.left and not node.right:
            self.char_binary[node.data] = binary_str
            return
        self.build_codes(node.left, binary_str + '0')
        self.build_codes(node.right, binary_str + '1')

    def display_codes(self):
        for char, code in self.char_binary.items():
            print(f"{repr(char)}: {code}")

    def generate_encoding(self):
        self.build_frequency_table()
        self.build_heap()
        self.build_huffman_tree()
        if self.root:
            self.build_codes(self.root)
        self.display_codes()

    def encode_file(self, input_file):
        output_file = input_file[:-3] + 'bin'
        with open(input_file, 'r') as file, open(output_file, 'wb') as output:
            encoded_txt = ''.join(self.char_binary[char] for char in file.read())

            # Slice 8 bits and convert into byte array
            byte_array = bytearray(int(encoded_txt[i:i+8], 2) for i in range(0, len(encoded_txt), 8))
            pickle.dump((self.char_binary,byte_array), output)

    def decode_file(self, input_file):
        output_file = input_file[:-4] + '_decoded.txt'
        with open(input_file, 'rb') as file:
            char_binary, byte_array = pickle.load(file)

            root = self.build_huffman_tree_from_codes(char_binary)

            binary_str = ''.join(format(byte, '08b') for byte in byte_array)

            decoded_text = self.decode_with_tree(binary_str, root)

            with open(output_file, 'w') as decoded_file:
                decoded_file.write(decoded_text)

    def build_huffman_tree_from_codes(self, codes):
        root = Node()
        for char, binary_str in codes.items():
            current_node = root
            for bit in binary_str:
                if bit == '0':
                    if not current_node.left:
                        current_node.left = Node()
                    current_node = current_node.left
                else:
                    if not current_node.right:
                        current_node.right = Node()
                    current_node = current_node.right
            current_node.data = char
        return root

    def decode_with_tree(self, binary_str, root):
        decoded_text = []
        current_node = root
        for bit in binary_str:
            current_node = current_node.left if bit == '0' else current_node.right
            if not current_node.left and not current_node.right:
                decoded_text.append(current_node.data)
                current_node = root
        return ''.join(decoded_text)


# Usage Example
huffman = HuffmanCoding('35M.txt')
huffman.generate_encoding()
huffman.encode_file('35M.txt')
huffman.decode_file('35M.bin')

print(os.stat('35M.txt').st_size)
print(os.stat('35M.bin').st_size)
print(os.stat('35M.txt').st_size)