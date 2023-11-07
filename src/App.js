import { MissionUtils } from "@woowacourse/mission-utils";
import Lotto from "./Lotto.js";
import {
  INPUT_MESSAGES,
  OUTPUT_MESSAGES,
  ERROR_MESSAGES,
} from "./constants/Messages.js";
import { PRIZE } from "./constants/Prize.js";

/*
추가된 요구 사항
함수(또는 메서드)의 길이가 15라인을 넘어가지 않도록 구현한다.
  함수(또는 메서드)가 한 가지 일만 잘 하도록 구현한다.
else를 지양한다.
  힌트: if 조건절에서 값을 return하는 방식으로 구현하면 else를 사용하지 않아도 된다.
  때로는 if/else, switch문을 사용하는 것이 더 깔끔해 보일 수 있다. 어느 경우에 쓰는 것이 적절할지 스스로 고민해 본다.
도메인 로직에 단위 테스트를 구현해야 한다. 단, UI(Console.readLineAsync, Console.print) 로직에 대한 단위 테스트는 제외한다.
  핵심 로직을 구현하는 코드와 UI를 담당하는 로직을 구분한다.
  단위 테스트 작성이 익숙하지 않다면 __tests__/LottoTest.js를 참고하여 학습한 후 테스트를 구현한다.
*/

//TODO: 로또 클래스 및 메서드 분리
//TODO: 테스트 케이스 작성하기
//TODO: 프로그래밍 요구 사항에 맞는지 확인

class App {
  async play() {
    const INPUT_CASH = await this.validateCash();
    const ARRAY_OF_GAMES = this.pushLottoNumbers(
      this.showGameNumbers(INPUT_CASH)
    );
    const VERIFIED_WINNING_NUMBER = await this.validateWinningNumber();
    const VERIFIED_BOUNUS_NUMBER = await this.validateBonusNumber(
      VERIFIED_WINNING_NUMBER
    );
    const NUMBER_OF_WINS = this.compareLottoNumber(
      ARRAY_OF_GAMES,
      VERIFIED_WINNING_NUMBER,
      VERIFIED_BOUNUS_NUMBER
    );
    this.showLottoResult(NUMBER_OF_WINS, INPUT_CASH);
  }

  async inputCash() {
    const INPUT_CASH = await MissionUtils.Console.readLineAsync(
      INPUT_MESSAGES.INPUT_CASH_MESSAGE
    );
    return INPUT_CASH;
  }

  async validateCash() {
    while (true) {
      try {
        const INPUT_CASH = await this.inputCash();
        this.validateCashInteger(INPUT_CASH);
        return INPUT_CASH;
      } catch (error) {
        MissionUtils.Console.print(error.message);
      }
    }
  }

  validateCashInteger(cash) {
    if (+cash % 1000 === 0) {
      return cash;
    }
    throw new Error(ERROR_MESSAGES.CASH_NOT_INTEGER_IN_THOUSANDS);
    //if(돈을 입력하지 않은 경우)
  }

  createLottoNumber() {
    return new Lotto(MissionUtils.Random.pickUniqueNumbersInRange(1, 45, 6));
  }

  pushLottoNumbers(NUMBER_OF_GAMES) {
    const ARRAY_OF_GAMES = [];
    for (let i = 0; i < NUMBER_OF_GAMES; i++) {
      const EACH_LOTTO_NUMBER = this.createLottoNumber();
      EACH_LOTTO_NUMBER.printLottoNumber();
      ARRAY_OF_GAMES.push(EACH_LOTTO_NUMBER);
    }
    return ARRAY_OF_GAMES;
  }

  outputLottoNumbers(SORTED_LOTTO_NUMBER) {
    MissionUtils.Console.print(`[${SORTED_LOTTO_NUMBER.join(", ")}]`);
  }

  showGameNumbers(INPUT_CASH) {
    const NUMBER_OF_GAMES = INPUT_CASH / 1000;
    MissionUtils.Console.print(
      NUMBER_OF_GAMES + OUTPUT_MESSAGES.PURCHASE_QUANTITY
    );
    return NUMBER_OF_GAMES;
  }

  inputWinningNumber() {
    const WINNING_NUMBER = MissionUtils.Console.readLineAsync(
      INPUT_MESSAGES.INPUT_WINNING_NUMBER
    );
    return WINNING_NUMBER;
  }

  async validateWinningNumber() {
    while (true) {
      try {
        const WINNING_NUMBER = await this.inputWinningNumber();
        const WINNING_NUMBER_ARRAY = WINNING_NUMBER.split(",").map(Number);
        this.validateWinningNumberCollection(WINNING_NUMBER_ARRAY);
        return WINNING_NUMBER_ARRAY;
      } catch (error) {
        MissionUtils.Console.print(error.message);
      }
    }
  }

  validateWinningNumberCollection(WINNING_NUMBER_ARRAY) {
    this.validateWinningNumberSix(WINNING_NUMBER_ARRAY);
    this.validateWinningNumberOutOfBounds(WINNING_NUMBER_ARRAY);
    this.validateWinningNumberDuplication(WINNING_NUMBER_ARRAY);
  }

  validateWinningNumberSix(WINNING_NUMBER_ARRAY) {
    if (WINNING_NUMBER_ARRAY.length !== 6) {
      throw new Error(ERROR_MESSAGES.WINNING_NUMBER_NOT_SIX);
    }
  }

  validateWinningNumberOutOfBounds(WINNING_NUMBER_ARRAY) {
    if (!WINNING_NUMBER_ARRAY.every((number) => number >= 1 && number <= 45)) {
      throw new Error(ERROR_MESSAGES.WINNING_NUMBER_OUT_OF_BOUNDS);
    }
  }

  validateWinningNumberDuplication(WINNING_NUMBER_ARRAY) {
    const UNIQUE_ARRAY = [...new Set(WINNING_NUMBER_ARRAY)];
    if (WINNING_NUMBER_ARRAY.length !== UNIQUE_ARRAY.length) {
      throw new Error(ERROR_MESSAGES.WINNING_NUMBER_DUPLICATION);
    }
  }

  inputBonusNumber() {
    const BOUNUS_NUMBER = MissionUtils.Console.readLineAsync(
      INPUT_MESSAGES.INPUT_BOUNUS_NUMBER
    );
    return BOUNUS_NUMBER;
  }

  async validateBonusNumber(VERIFIED_WINNING_NUMBER) {
    while (true) {
      try {
        const BOUNUS_NUMBER = await this.inputBonusNumber();
        this.validateBonusNumberCollection(
          BOUNUS_NUMBER,
          VERIFIED_WINNING_NUMBER
        );
        const VERIFIED_BOUNUS_NUMBER = Number(BOUNUS_NUMBER);
        return VERIFIED_BOUNUS_NUMBER;
      } catch (error) {
        MissionUtils.Console.print(error.message);
      }
    }
  }

  validateBonusNumberCollection(BOUNUS_NUMBER, VERIFIED_WINNING_NUMBER) {
    this.validateBonusNumberOutOfBounds(BOUNUS_NUMBER);
    this.validateBonusNumberDuplicatedWithWinningNumber(
      VERIFIED_WINNING_NUMBER,
      BOUNUS_NUMBER
    );
    this.validateBonusNumberInteger(BOUNUS_NUMBER);
  }

  validateBonusNumberOutOfBounds(BOUNUS_NUMBER) {
    if (BOUNUS_NUMBER < 1 || BOUNUS_NUMBER > 45) {
      throw new Error(ERROR_MESSAGES.BONUS_NUMBER_OUT_OF_BOUNDS);
    }
  }

  validateBonusNumberDuplicatedWithWinningNumber(
    VERIFIED_WINNING_NUMBER,
    BOUNUS_NUMBER
  ) {
    if (VERIFIED_WINNING_NUMBER.includes(+BOUNUS_NUMBER)) {
      throw new Error(
        ERROR_MESSAGES.BONUS_NUMBER_DUPLICATION_WITH_WINNING_NUMBER
      );
    }
  }

  validateBonusNumberInteger(BOUNUS_NUMBER) {
    if (!Number.isInteger(+BOUNUS_NUMBER)) {
      throw new Error(ERROR_MESSAGES.BONUS_NUMBER_NOT_INTEGER);
    }
  }

  compareLottoNumber(lottoNumber, winningNumber, bonusNumber) {
    let NumberOfWins = { 3: 0, 4: 0, 5: 0, 6: 0, bonus: 0 };
    for (let i = 0; i < lottoNumber.length; i++) {
      let { correctCount, bonusFlag } = lottoNumber[i].compareLottoNumber(
        winningNumber,
        bonusNumber
      );
      if (correctCount !== 0) {
        NumberOfWins[correctCount]++;
      }
      if (bonusFlag) {
        NumberOfWins["bonus"]++;
      }
    }
    return NumberOfWins;
  }

  showLottoResult(NUMBER_OF_WINS, cash) {
    const PRIZE_VALUE = this.getPrizeValue(NUMBER_OF_WINS);
    MissionUtils.Console.print(OUTPUT_MESSAGES.WINNING_STATISTICS);
    this.showEachPrize(NUMBER_OF_WINS);
    const RATE_OF_RETURN = ((PRIZE_VALUE / cash) * 100).toFixed(1);
    MissionUtils.Console.print(
      OUTPUT_MESSAGES.RATE_OF_RETURN + RATE_OF_RETURN + "%입니다."
    );
  }

  getPrizeValue(NUMBER_OF_WINS) {
    let prizeValue =
      NUMBER_OF_WINS[3] * PRIZE.THREE_MATCHES +
      NUMBER_OF_WINS[4] * PRIZE.FOUR_MATCHES +
      (NUMBER_OF_WINS[5] - NUMBER_OF_WINS["bonus"]) * PRIZE.FIVE_MATCHES +
      NUMBER_OF_WINS[6] * PRIZE.SIX_MATCHES +
      NUMBER_OF_WINS["bonus"] * PRIZE.BONUS_MATCHES;
    return prizeValue;
  }

  showEachPrize(NUMBER_OF_WINS) {
    MissionUtils.Console.print(
      OUTPUT_MESSAGES.CORRECT_COUNT_OUTPUT_3 + NUMBER_OF_WINS[3] + "개"
    );
    MissionUtils.Console.print(
      OUTPUT_MESSAGES.CORRECT_COUNT_OUTPUT_4 + NUMBER_OF_WINS[4] + "개"
    );
    this.showBonusPrize(NUMBER_OF_WINS);
    MissionUtils.Console.print(
      OUTPUT_MESSAGES.CORRECT_COUNT_BONUS + NUMBER_OF_WINS["bonus"] + "개"
    );
    MissionUtils.Console.print(
      OUTPUT_MESSAGES.CORRECT_COUNT_OUTPUT_6 + NUMBER_OF_WINS[6] + "개"
    );
  }

  showBonusPrize(NUMBER_OF_WINS) {
    MissionUtils.Console.print(
      OUTPUT_MESSAGES.CORRECT_COUNT_OUTPUT_5 +
        (NUMBER_OF_WINS[5] - NUMBER_OF_WINS["bonus"]) +
        "개"
    );
  }
}
export default App;
