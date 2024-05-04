from src.file1 import run
import src.file2 as file2
from src.db import db1

def main():
    run()
    file2.run()
    db1.run()

if __name__ == "__main__":
    main()