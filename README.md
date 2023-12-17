# TEXT2POKEMON-Instruct-pix2pix
We have fine-tuned the Instruct Pix2Pix model to create a system that can colorize characters in images using only text.

## Table of contents

🐶 [dataset](#dataset) <br>
📷 [image-captioning](#image-captioning) <br>
💺 [fine-tuning](#training) <br>
🎛 [WEB SERVICE](#web) <br>


# datasets
<br>
<br>

# datasets 개요

이 프로젝트는 instruct pix2pix 모델을 사용하여 흑백 이미지를 사용자의 캡션에 맞게 채색하는 기술을 개발하고 테스트 하기 위한 것입니다. 목표는 흑백 이미지에 사용자의 캡션에 따라 색상을 부여하여 컬러 이미지로 출력하는 것 입니다. 이러한 기술은 역사적 사진, 예술 작품 등 다양한 분야에서 활용 될 수 있습니다.

# datasets 출처

본 데이터셋은 svjack/pokemon-blip-captions-en-ja의 캡션 데이터, Sketch2Pokemon의 컬러, 흑백 이미에 해당하며, 2023년 7월 기준으로 수집되었습니다. 데이터 사용에 대한 라이선스 및 저작권 정보는
<br>
[svjack/pokemon-blip-captions-en-ja · Datasets at Hugging Face](https://huggingface.co/datasets/svjack/pokemon-blip-captions-en-ja/viewer/svjack--pokemon-blip-captions-en-ja/train?p=0&row=41)
<br>
[Sketch2Pokemon](https://www.kaggle.com/datasets/norod78/sketch2pokemon)

svjack/pokemon-blip-captions-en-ja 에서 캡션을 수집, Sketch2Pokemon에서 쌍으로 이루어진 흑백 이미지와 컬러 이미지를 수집하였습니다.

수집한 흑백 이미지와 컬러 이미지의 크기는 256x256, png형식 입니다. (크기를 맞출 필요는 없습니다.) 각 데이터들은 csv파일로 모델에 적용되었습니다. 흑백 이미지, 컬러 이미지 그리고 이미지를 설명하는 캡션을 매칭시킨 형태로 구성 되었습니다.  학습 시킨 이미지는 쌍으로 이루어진 흑백, 컬러 이미지 각각 826장, 이미지를 설명하는 캡션 307개 입니다.

|  | 흑백 이미지 | 컬러 이미지 | cation |
| --- | --- | --- | --- |
| 이미지 개수 | 826 | 826 | 307 |
| 크기 | 28.6MB | 37.6MB | 15.1KB |

사용자는 자신의 데이터셋을 구조에 맞게 준비해야 합니다. 각 이미지에 맞게 이미지 경로를 정확하게 매칭 시키고, 이미지를 설명하는 캡션을 추가해야 합니다.

?? 데이터 셋의 저작권 여부 같은 것도 적어야한다는데 포켓몬의 경우 닌텐도꺼라고 적어놔야하나요/?

# datasets 구조

사용된 데이터셋은 흑백 이미지, 컬러 이미지와 컬러 이미지를 설명하는 캡션이 쌍으로 이루어져 있는 구조입니다.

- 흑백 이미지 : 원본 컬러 이미지에서 색상 정보를 제거한 이미지입니다. 이 흑백 이미지들은 모델이 채색을 수행할 대상이 됩니다.
- 컬러 이미지 : 흑백 이미지와 쌍을 이루는 원본 컬러 이미지입니다. 이 컬러 이미지들은 모델이 채색 패턴을 학습하는 데 사용됩니다.
- 캡션 : 원본 컬러 이미지를 설명하는 짧은 문장입니다. 이 캡션은 원본 컬러 이미지의 색상 정보, 특징 정보를 포함합니다.

![0.jpg](datasets%20694d4be321bd469488442bcff68377bf/0.jpg)

<aside>
👉 a drawing of a green pokemon with red eyes

</aside>

위 쌍을 이루는 흑백 이미지, 컬러 이미지와 캡션은 하나의 예시입니다.

이 데이터 셋은 학습에 필요한 것으로, 캡션의 경우 더 많은 색상 정보와 특징을 담는다면, 모델 향상에 도움이 됩니다.


# image captioning

# 🖼️image captioning

우리가 가진 dataset 에 대해서 알맞는 caption을 자동화하여 생성할 수 있도록 image captioning모델을 사용하여

caption data를 생성하였다.

Instruct pix2pix 모델을 finetuning 시킬 때 다량의 caption data가 필요하므로 포켓몬 이미지의 정보를 text로 나타내줄 수 있는 image captioning model을

선정 해야했다. 그 중 “**CNN-LSTM”**과 “**CLIP”** 2개의 모델이 후보에 올랐다.

이 중에서 포켓몬 이미지의 색 정보를 더 잘 이해하고 caption으로 추출할 수 있는 모델을  선택하는 것이 관건이었다.

                                                                                      후보 모델군

![CNN-LSTM](image%20captioning%208eeb9a02691645fd9034124f8a4f20ac/Untitled.png)

CNN-LSTM

![CLIP](image%20captioning%208eeb9a02691645fd9034124f8a4f20ac/Untitled%201.png)

CLIP

위 모델의 특징을 Encoder, Decoder 유무로 발생하는 차이로 설명을 할 수 있다.

**(1)Encoder(CLIP)**

특정 input data가 들어왔을 때 그것을 잘 요약을 해줘서 잠재적인 정보(latent vector)에 초점을 맞추었기 때문에 상대적으로 정보의 자유도는 높은 결과를 얻을 수 있다. **->”zero-shot” 성능 우수**

**(2)Encoder, Decoder(CNN-LSTM)**

****우선 encoder로 latent vector를 추출하고 decoder를 통해서 정제된 caption을 잘 추출할 수 있다. 

-> **성능 밸런스 우수**

# 🧐**모델 성능 평가 및 선정 이유**

모델을 돌려본 결과, CNN-LSTM에서는 unknown token이 발생하여 이미지의 중요한 색 정보를 표현하지 못하였다. 하지만 latent vector에 초점을 맞춘 CLIP은 CNN-LSTM에 비해 뛰어난 성능을 보여주었기 때문에 **CLIP으로 826개의 caption data를 생성하였다**.

CLIP은 meta에서 2022년에 발표한 모델로 10억개의 데이터 기반으로 noise가 조금 있지만 표현의 범위가 보다 다양한 것을 볼 수 있다.

| CNN-LSTM | CLIP |
| --- | --- |
| Turn it into a drawing with a <unk> body, <unk> face, and <unk> horns. | Turn it into a close up of a cartoon bird with a red head and white wings, style of pokemon, werecrow, ultra-high resolution, kid named finger, cleanest image, wildfire, metalhead, soaring, tuxedo, black white red, folklore |

# 🖥️FINE TUNING

이제 필요한 학습에 필요한 데이터셋이 모두 구축이 되었으니 instruct pix2pix 모델을 포켓몬 채색에 최적화된 모델로 만들기 위해 fine-tuning을 해볼 것이다. fine-tuning을 할 때 다음과 같은 github, huggingface 레퍼런스를 참고하여 하였다.

[GitHub - huggingface/instruction-tuned-sd: Code for instruction-tuning Stable Diffusion.](https://github.com/huggingface/instruction-tuned-sd)

학습 환경은 PyTorch 1.13.1 (CUDA 11.6) GPU RTX4090 을 사용하여 학습하였고.

 xformer 0.0.16 을 사용하여 메모리에 효율적인 학습을 하다.

# 📖학습결과

![Untitled](image%20captioning%208eeb9a02691645fd9034124f8a4f20ac/Untitled%202.png)

이와 같은 결과는 instruct pix2pix model에 그림의 정보를 설명하는 caption과 변환전 image,변환 후 image를 넣고 fine-tuning을 한 후 **사용자가 원하는 부위에 원하는 색을 칠하겠다는 prompt를 fine-tuning된 모델이 받으면 세밀하게 스케치의 부위를 인식하고 색을 칠해줄 수 있다는 것을 증명한다.** 또한 CNN-LSTM의 caption data와 CLIP의 caption data를 학습시킨 경우를 비교하면 학습된 caption의 질에 따라 확연히 결과가 다른 것을 볼 수 있고 instruct pix2pix는 다양한 편집능력을 가지고있고 제로샷 성능도 높기 때문 질과 양에서 우수한 data를 학습시킨다면 그에 따른 성능도 눈에 띄게 향상될 것이라 기대해 볼 수 있는 결과가 나타났다.

**fine-tuning code**

```python
export MODEL_ID="timbrooks/instruct-pix2pix"
export DATASET_ID="instruction-tuning-sd/cartoonization"
export OUTPUT_DIR="cartoonization-finetuned"

accelerate launch --mixed_precision="fp16" finetune_instruct_pix2pix.py \
--pretrained_model_name_or_path=$MODEL_ID \
--dataset_name=$DATASET_ID \
--use_ema \
--enable_xformers_memory_efficient_attention \
--resolution=256 --random_flip \
--train_batch_size=2 --gradient_accumulation_steps=4 --gradient_checkpointing \
--max_train_steps=15000 \
--checkpointing_steps=5000 --checkpoints_total_limit=1 \
--learning_rate=5e-05 --lr_warmup_steps=0 \
--mixed_precision=fp16 \
--val_image_url="./pokemon_pix2pix_dataset/trainA/0002.png" \
--validation_prompt="a cartoon character with a potted plant on his head" \
--seed=42 \
--output_dir=$OUTPUT_DIR \
--report_to=wandb \
--push_to_hub
```

## 📍image resource

<a href="https://www.pinterest.co.kr/">CollectPage Header background by Pinterest</a>

<a href="https://www.flaticon.com/kr/free-icons/-">pokeball image, search-icon image by Flaticon</a>

<a href="https://www.pxfuel.com/ko/desktop-wallpaper-sshss">CollectPage main background by Pxfuel</a>
