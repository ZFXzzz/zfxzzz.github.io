# Kimi K3 — experiment notes / 实验摘要

This is a curated extract of the owner's local experiment audit, not an independently hosted raw-log bundle.
本文为个人本地实验审核记录的整理摘编，不是原始日志包或第三方评测。

## Identity / 测试标识

- Run: `k3-pr-full-20260914-062444`
- Date: 2026-09-14
- Hardware: 2 nodes × 8 NVIDIA H20-3e GPUs, 16 GPUs total
- Engine: vLLM `0.28.0+cu129`, Ray backend
- Parallelism: TP16 + Expert Parallel
- Backends: Marlin / FLASHMLA
- `max_model_len=131072`; `max_num_seqs=32`
- Prefix caching was enabled. DSpark speculative decoding was not enabled.

## Short-context concurrency / 短上下文并发

- Requested input: 8,192 tokens
- Output budget: 512 tokens
- Requests per concurrency level: 32
- Completion: 32/32 at every level
- Throughput below means **aggregate output tokens per second**, not per-request decode speed.

| Concurrency | Output tok/s | Mean TTFT (ms) | Mean TPOT (ms) | Completed |
|---|---:|---:|---:|---:|
| C1 | 30.09 | 1559.90 | 30.24 | 32/32 |
| C2 | 59.24 | 448.99 | 32.95 | 32/32 |
| C4 | 100.59 | 660.71 | 38.54 | 32/32 |
| C8 | 154.52 | 1100.08 | 49.71 | 32/32 |
| C16 | 241.56 | 2016.69 | 62.40 | 32/32 |
| C32 | 314.46 | 2923.57 | 96.05 | 32/32 |

Higher aggregate throughput at C32 came with a latency cost. The C1 TTFT observation also shows why the series should be read as recorded data rather than an idealized monotonic latency curve.
C32 聚合吞吐提高，同时付出了延迟代价；C1 的 TTFT 也说明，应按实际记录解读结果，不能把它画成理想化的单调延迟曲线。

## Separate context-boundary test / 独立上下文测试

- Requested input: 128,000 tokens, C1, 3 requests, output budget 512.
- Completed: 3/3.
- Mean actual input: approximately 129,807 tokens per request, including template/tokenizer overhead.
- A 130,000 requested-input test was rejected by the context budget as expected.
- This does **not** establish 128K at C32. It is separate from the 8K concurrency series.

## Evidence boundaries / 证据边界

- Cold-cache performance, 128K concurrency and long-duration stability remain unvalidated.
- Same-window service logs and the worker after-snapshot had gaps in the local audit.
- Some environment-version evidence remained incomplete.
- These results are experiment-specific and are not a production SLO or cross-hardware promise.

## Contribution records / 开源贡献记录

- FlashInfer diagnostic PR: https://github.com/flashinfer-ai/flashinfer/pull/5154
- vLLM original PR: https://github.com/vllm-project/vllm/pull/56675
- vLLM follow-up PR: https://github.com/vllm-project/vllm/pull/56678

Contribution links document submissions and follow-up work; they are not public hosting for the local raw benchmark logs. Consult GitHub for current review and merge status.
