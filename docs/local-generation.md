# Local Image Generation with Z-Image Turbo

Generate images locally, free and private, using Alibaba's Z-Image Turbo model via ComfyUI.

## What is Z-Image Turbo?

Z-Image Turbo is a high-quality, fast text-to-image diffusion model from Alibaba under the Apache 2.0 license. It runs entirely on your device — no cloud required, no usage limits, no costs.

- **Model**: Z-Image Turbo (Apache 2.0 licensed)
- **Runtime**: ComfyUI (open-source node-based image generation)
- **Privacy**: 100% on-device, no data sent to cloud
- **Cost**: Free (after initial setup)

## Hardware Requirements

Local generation is supported on consumer-grade GPUs with sufficient VRAM:

| GPU Type | Minimum VRAM | Model Tier | Speed | Notes |
|----------|--------------|-----------|-------|-------|
| **NVIDIA** | 8GB+ | int8 | ~1-2 min/image | Quantized, optimal for 8-13GB VRAM |
| NVIDIA | 14GB+ | bf16 | ~30-45 sec/image | Full precision, better quality |
| **Apple Silicon** (Mac) | 16GB+ | int8 | ~2-3 min/image | MPS backend, slower than NVIDIA |
| Intel Arc/UHD | ❌ | - | - | Not currently supported |

### Cloud Alternative

If your hardware doesn't meet requirements:
- Visit [gwanggo.jocoding.io](https://gwanggo.jocoding.io)
- Sign up and get **35 free credits** to generate with cloud models
- No hardware limits, faster generation (Seedream 4.5, etc.)

## Installation

### macOS (Apple Silicon only)

```bash
curl -fsSL https://raw.githubusercontent.com/bill-95/gwanggo-studio/main/scripts/local/install.sh | bash
```

Then start the server:
```bash
bash ~/gwanggo-local/run.sh
```

### Linux (NVIDIA GPU required)

```bash
curl -fsSL https://raw.githubusercontent.com/bill-95/gwanggo-studio/main/scripts/local/install.sh | bash
```

Then start the server:
```bash
bash ~/gwanggo-local/run.sh
```

### Windows

1. Download [install.ps1](../scripts/local/install.ps1)
2. Right-click → "Run with PowerShell"
3. Or run in PowerShell:
   ```powershell
   powershell -ExecutionPolicy Bypass -File install.ps1
   ```

Then start the server:
```powershell
powershell "~/gwanggo-local/run.ps1"
```

## How gwanggo-studio Detects the Local Runtime

Once the ComfyUI server is running on `localhost:8188`, gwanggo-studio automatically:
1. Detects the local ComfyUI server
2. Shows "Z-Image Turbo (Local · Free)" as an available option
3. Routes image generation requests to the local server

**No additional configuration needed** — just ensure ComfyUI is running.

## Troubleshooting

### CORS Error in Browser Console
**Symptom**: "Access to XMLHttpRequest blocked by CORS policy"
**Fix**: The install script automatically adds `--enable-cors-header "*"` to ComfyUI. Ensure you're running the generated `run.sh` (not ComfyUI directly).

### Port 8188 Already in Use
**Symptom**: "Address already in use"
**Fix**: Either kill the existing process or modify the run script to use a different port:
```bash
# Kill existing ComfyUI
lsof -ti:8188 | xargs kill -9

# Or change port in run.sh to 8189:
# --port 8189
```

### Connection Refused to localhost:8188
**Symptom**: "Connection refused" or "Failed to connect"
**Fix**: Verify ComfyUI is running:
```bash
curl http://localhost:8188
```

Should return ComfyUI web interface. If not, start the server:
```bash
bash ~/gwanggo-local/run.sh
```

### Slow Generation (int8 Model)
If using int8 (8-13GB GPU), generation is slower (~1-2 min/image):
- This is normal for quantized models
- Upgrade to 14GB+ VRAM for bf16 (30-45 sec/image)
- Or use cloud generation for faster results

## Model Files

The installer downloads these files to `~/gwanggo-local/ComfyUI/models/`:

**bf16 Tier (14GB+ VRAM):**
- `diffusion_models/z_image_turbo_bf16.safetensors` (11.5GB)
- `text_encoders/qwen_3_4b.safetensors` (7.5GB)
- `vae/ae.safetensors` (0.31GB)

**int8 Tier (8-13GB VRAM):**
- `diffusion_models/z_image_turbo_int8_convrot.safetensors` (5.8GB)
- `text_encoders/qwen_3_4b_fp8_mixed.safetensors` (5.3GB)
- `vae/ae.safetensors` (0.31GB)

**Total size**: ~19GB (bf16) or ~11GB (int8)

## First Run

After installation:

1. Start ComfyUI:
   ```bash
   bash ~/gwanggo-local/run.sh
   ```
   You should see:
   ```
   listening on http://127.0.0.1:8188
   ```

2. Open [gwanggo-studio](http://localhost:3000)

3. Create an image:
   - Model → "Z-Image Turbo (Local · Free)"
   - Enter prompt
   - Generate

4. First generation may be slow (~1-2 min) as models warm up in VRAM

## Development / Advanced Setup

To manually clone and set up ComfyUI:

```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu124  # Linux
# or
pip install torch torchvision  # macOS (uses MPS)

python main.py --listen 127.0.0.1 --port 8188 --enable-cors-header "*"
```

Then download models manually from [huggingface.co/Comfy-Org/z_image_turbo](https://huggingface.co/Comfy-Org/z_image_turbo/tree/main).

## Performance Tips

- **Keep ComfyUI running** in the background while using gwanggo-studio
- **First generation is slowest** (model loading into VRAM)
- **Subsequent generations are ~30-40% faster**
- **Close other GPU apps** (video players, games, Chrome tabs) for best performance
- **Use int8** if you have 8-13GB VRAM (quantization enables it)
- **Use bf16** if you have 14GB+ VRAM (better quality, same speed as int8)

## Limitations

- Requires dedicated NVIDIA GPU or Apple Silicon Mac (16GB+ unified memory)
- Slower than cloud models for quick batch generation
- May require 30-45 min for first setup (model downloads)
- Requires Python 3.10+, git, and ~20GB free disk space

## Cloud Fallback

For images requiring higher quality, faster generation, or special effects:
- Use [gwanggo.jocoding.io](https://gwanggo.jocoding.io) cloud models
- Get 35 free credits on signup
- No hardware limits, unlimited speed

---

**Apache 2.0 Licensed** | [ComfyUI Project](https://github.com/comfyanonymous/ComfyUI) | [Z-Image Turbo Model](https://huggingface.co/Comfy-Org/z_image_turbo)
