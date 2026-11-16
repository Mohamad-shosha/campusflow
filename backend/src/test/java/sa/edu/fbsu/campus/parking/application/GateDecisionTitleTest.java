package sa.edu.fbsu.campus.parking.application;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Gate greeting does not double the doctor title")
class GateDecisionTitleTest {

    @Test
    void arabicTitleAddedOnlyWhenMissing() {
        assertThat(GateDecisionService.titledAr("محمد مزهر")).isEqualTo("د. محمد مزهر");
        assertThat(GateDecisionService.titledAr("د. محمد مزهر")).isEqualTo("د. محمد مزهر");
    }

    @Test
    void englishTitleAddedOnlyWhenMissing() {
        assertThat(GateDecisionService.titledEn("Mohammad Mezher")).isEqualTo("Dr. Mohammad Mezher");
        assertThat(GateDecisionService.titledEn("Dr. Mohammad Mezher")).isEqualTo("Dr. Mohammad Mezher");
        assertThat(GateDecisionService.titledEn("dr. Sarah")).isEqualTo("dr. Sarah");
    }
}
