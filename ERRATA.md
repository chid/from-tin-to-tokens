# Errata

Confirmed corrections to the current edition, and the edition each one lands in. The list is built from reader reports.

Check here before reporting, to avoid duplicates. If your correction isn't listed, open an [erratum](https://github.com/MaincodeHQ/from-tin-to-tokens/issues/new/choose) with the edition and page number.

## v1.0 (2026)

| Page | Section | Correction |
|------|---------|------------|
| 17, 54 | Ch 1: Key Concept; Ch 8: Fig 8.1 | Arithmetic intensity verbal description states "group size over KV byte width" for $(2/b) \times G$. It should read "twice the group size over KV byte width" (for FP16 where $b=2$, $(2/2) \times G = G$, not $G/2$). |
| 43, 180 | Ch 6: Safe views; App A: DeviceBuffer | `DeviceBuffer::as_mut_slice` attempts to dereference `self.va as *mut u8` directly on host CPU via `core::slice::from_raw_parts_mut`. In KFD, `va` is a GPU virtual address; host CPU access requires mapping via `mmap()` using the driver's returned `mmap_offset`, or maintaining a separate host pointer. |
| 59 | Ch 9: Why partial results merge exactly | Pairwise partial result merge formula prematurely divides by $Z$: $O = (e^{m_1-m}O_1 + e^{m_2-m}O_2) / Z$. This breaks associativity $((s_1 \oplus s_2) \oplus s_3 \ne s_1 \oplus (s_2 \oplus s_3))$ and contradicts the rule that $O$ must remain unnormalised until the final step. Unnormalised accumulator should be $O = e^{m_1-m}O_1 + e^{m_2-m}O_2$, or if merging normalised outputs, $O = (e^{m_1-m}Z_1O_1 + e^{m_2-m}Z_2O_2) / Z$. |
| 64 | Ch 10: Performance, measured against ceiling | Typo: "And the FP8 result is reproduces the arithmetic..." should be "And the FP8 result reproduces the arithmetic...". |
| 82 | Ch 15: Continuous Batching | Continuous batching pseudocode: `for req in finished` iterates without clearing/draining `finished` (should be `finished.drain(..)`), and `while let Some(req) = queue.peek()` with `admit(req)` does not pop, creating an infinite admission loop. |
| 116 | Ch 24: Quantised experts; Exercises | Shared expert bandwidth amortisation is inverted. Reads: "watch the shared expert, which every token reads regardless of routing, so its bandwidth cost doesn't amortise with batch the way routed experts do". Should read: "watch the shared expert, which every token reads regardless of routing: like any dense weight its per-token bandwidth falls as 1/B from batch 1 (43 MB/token at batch 1 → 0.67 MB/token at batch 64 in DeepSeek-V3), while routed expert traffic per token only falls once the active expert set saturates — sparsity offers no saving on the shared expert, but batching does". Exercise 2 on the same page is also affected ("identify which component fails to amortise with batch"). (See [interactive explainer](book/shared-expert-amortization.html)). |
| 140 | Ch 30: The transfer cost, computed honestly | Table 30.1 column 3 header reads `TRANSFER AT 400 GB/S (50 GB/S)` with capital `GB/S`. Should be `TRANSFER AT 400 Gb/s (50 GB/s)` to distinguish gigabits from gigabytes (calculations correctly use 50 GB/s). |
| 176 | Ch 39: Exercises | Exercise 2 is truncated mid-sentence: "2. Your team wants to start at Phase 5 using a vendor runtime for Phases 1 to" and question text mangled into item 3. Should read: "2. Your team wants to start at Phase 5 using a vendor runtime for Phases 1 to 4. Which gates can you still apply, which do you lose, and what would you add to compensate?". |

Status is one of: confirmed, queued for the next edition, or fixed in a later edition.
