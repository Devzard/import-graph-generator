## Setup environment
### Backend
1. Create environment
    ```sh
    conda create --name graph-maker python=3.12.3
    ```
2. Install dependencies
    ```sh
    pip install -r requirements.txt
    ```
### Frontend
Go to `/graph-renderer-js`
```sh
cd /graph-renderer-js
```
then
```sh
npm install
# or
pnpm install
```

## Run
### Backend
At project root run 
```sh
python main.py
```

### Frontend
At `/graph-renderer-js` run
```sh
pnpm run dev
# or
npm run dev
```