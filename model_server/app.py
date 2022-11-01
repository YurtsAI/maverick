"""Maverick Model Server."""
import os
import requests
import tarfile
from threading import Lock

from flask import Flask, jsonify, request
from transformers import AutoModelForCausalLM, AutoTokenizer

app = Flask(__name__)
lock = Lock()


@app.route("/", methods=["POST", "GET"])
def predict():
    if request.method == "GET":
        return "Maverick loaded properly. " "Use POST methods to retrieve predictions."

    response_json = {}
    status_code = 200
    release_lock = False

    try:
        if not lock.acquire(blocking=False):
            raise

        release_lock = True
        text = request.json["text"]
        num_tokens = request.json.get("numTokens", 64)
        input_ids = tokenizer(text, return_tensors="pt").input_ids

        generated_ids = model.generate(
            input_ids,
            max_length=len(input_ids[0]) + num_tokens,
        )
        response_json = {
            "text": [
                tokenizer.decode(generated_id, skip_special_tokens=True)
                for generated_id in generated_ids
            ]
        }
    except:
        response_json = {
            "message": "Prediction in progress. Please wait for prediction to finish."
        }
        status_code = 500
    finally:
        if release_lock:
            lock.release()

    return jsonify(response_json), status_code



def unpack_model(
    tar_path: str, destination_dir: str = "./", is_remote: bool = True
) -> bool:
    """Unpack compressed model. If errors, returns False."""
    if is_remote:
        requests.get(tar_path)
    success = True
    try:
        file = tarfile.open(tar_path.split("/")[-1])
        file.extractall(destination_dir)
        file.close()
    except:
        success = False
    return success


def load_model(
    bucket: str = "https://yurts-models-public.s3.us-west-2.amazonaws.com",
    model_file: str = "codeGen-30sp_fp16.tar.gz",
    is_remote: bool = True,
    hf_id: str = "YurtsAI/yurts-python-code-gen-30-sparse",
):
    """Loads model from bucket or local file path."""
    success = unpack_model(tar_path=f"{bucket}/{model_file}", is_remote=is_remote)
    if not success:
        model_file = hf_id

    model = AutoModelForCausalLM.from_pretrained(model_file, torchscript=True)
    model = model.eval()
    tokenizer = AutoTokenizer.from_pretrained(model_file)

    return model, tokenizer



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 9401))
    model, tokenizer = load_model()
    app.run(debug=False, host="0.0.0.0", port=port)