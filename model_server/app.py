"""Maverick Model Server."""
import sys
from threading import Lock

from flask import Flask, jsonify, request

from model_server.utils.model_utils import load_model

app = Flask(__name__)
lock = Lock()


@app.route("/", methods=["POST", "GET"])
def predict():
    if request.method == "GET":
        return (
            "Maverick loaded properly. "
            "Use POST methods to retrieve predictions."
        )

    response_json = {}
    status_code = 200
    release_lock = False

    try:
        if not lock.acquire(blocking=False):
            raise

        release_lock = True
        text = request.json["text"]
        num_tokens = request.json.get("numTokens", 32)
        input_ids = tokenizer(text, return_tensors="pt").input_ids

        generated_ids = model.generate(
            input_ids,
            max_length=len(input_ids[0]) + num_tokens,
            pad_token_id=50256,
        )
        response_json = {
            "text": [
                tokenizer.decode(generated_id, skip_special_tokens=True)
                for generated_id in generated_ids
            ]
        }
    except Exception:
        response_json = {
            "message": (
                "Prediction in progress. "
                "Please wait for prediction to finish."
            )
        }
        status_code = 500
    finally:
        if release_lock:
            lock.release()

    return jsonify(response_json), status_code


if __name__ == "__main__":
    try:
        port = sys.argv[1]
    except IndexError:
        port = 9401
    model, tokenizer = load_model()
    app.run(debug=False, host="0.0.0.0", port=port)
