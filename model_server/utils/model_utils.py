"""Utils for model."""

import tarfile

import requests
from transformers import AutoModelForCausalLM, AutoTokenizer


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
